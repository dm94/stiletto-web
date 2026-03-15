import {
  Fragment,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router";
import { getPerks } from "@functions/github";
import {
  buildPerkGraph,
  canSelect,
  computeTotalCost,
  tryGetRequiredChain,
  togglePerk,
} from "@functions/perkCostEngine";
import type { Perk } from "@ctypes/perk";
import HeaderMeta from "@components/HeaderMeta";
import LoadingScreen from "@components/LoadingScreen";
import ModalMessage from "@components/ModalMessage";
import PerkTree from "@components/Perks/PerkTree";
import { getDomain } from "@functions/utils";
import { getStoredItem, storeItem } from "@functions/services";

const PERK_BUILD_STORAGE_KEY = "perk-calculator-build-v1";
const BUILD_QUERY_KEY = "build";

type SavedPerkBuild = {
  activeRoot?: string;
  selectedPerks: string[];
};

enum ShareStatusKey {
  BuildLinkCopied = "perksCalculator.shareStatus.copied",
  BuildLinkReadyToCopy = "perksCalculator.shareStatus.readyToCopy",
  BuildReset = "perksCalculator.shareStatus.reset",
}

const parseSavedBuild = (rawValue?: string): SavedPerkBuild | undefined => {
  if (rawValue == null || rawValue.length === 0) {
    return undefined;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<SavedPerkBuild>;
    const selectedPerks = Array.isArray(parsedValue.selectedPerks)
      ? parsedValue.selectedPerks.filter(
          (perkName): perkName is string => typeof perkName === "string",
        )
      : [];
    const activeRoot =
      typeof parsedValue.activeRoot === "string"
        ? parsedValue.activeRoot
        : undefined;

    return { activeRoot, selectedPerks };
  } catch {
    return undefined;
  }
};

const decodeBuildToken = (buildToken?: string): SavedPerkBuild | undefined => {
  if (buildToken == null || buildToken.length === 0) {
    return undefined;
  }

  try {
    return parseSavedBuild(decodeURIComponent(buildToken));
  } catch {
    return undefined;
  }
};

const encodeBuildToken = (savedBuild: SavedPerkBuild): string =>
  encodeURIComponent(JSON.stringify(savedBuild));

const removeStoredBuild = (): void => {
  localStorage.removeItem(PERK_BUILD_STORAGE_KEY);
  sessionStorage.removeItem(PERK_BUILD_STORAGE_KEY);
};

const PerkCostCalculator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [perks, setPerks] = useState<Perk[]>([]);
  const [selectedPerks, setSelectedPerks] = useState<Set<string>>(new Set());
  const [activeRoot, setActiveRoot] = useState<string>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>();
  const [didHydrateBuild, setDidHydrateBuild] = useState(false);
  const [shareStatusKey, setShareStatusKey] = useState<ShareStatusKey>();
  const rootTabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    let isMounted = true;

    const loadPerks = async () => {
      try {
        const fetchedPerks = await getPerks();
        if (!isMounted) {
          return;
        }

        setPerks(fetchedPerks ?? []);
      } catch {
        if (isMounted) {
          setError("errors.apiConnection");
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    loadPerks();

    return () => {
      isMounted = false;
    };
  }, []);

  const perkGraph = useMemo(() => buildPerkGraph(perks), [perks]);

  const logicalRoots = useMemo(
    () =>
      [...perkGraph.roots].sort((left, right) =>
        left.localeCompare(right, "en"),
      ),
    [perkGraph.roots],
  );

  const normalizeSelection = useCallback(
    (incomingSelection: readonly string[]): Set<string> => {
      const validNames: string[] = [];
      const depthByPerkName = new Map<string, number>();
      for (const perkName of incomingSelection) {
        if (!perkGraph.byName.has(perkName)) {
          continue;
        }

        const requiredChain = tryGetRequiredChain(perkName, perkGraph);
        if (requiredChain == null) {
          continue;
        }

        validNames.push(perkName);
        depthByPerkName.set(perkName, requiredChain.length);
      }

      validNames.sort((left, right) => {
        const leftDepth = depthByPerkName.get(left) ?? 0;
        const rightDepth = depthByPerkName.get(right) ?? 0;
        if (leftDepth !== rightDepth) {
          return leftDepth - rightDepth;
        }
        return left.localeCompare(right, "en");
      });

      let normalized = new Set<string>();
      for (const perkName of validNames) {
        normalized = togglePerk(perkName, normalized, perkGraph);
      }

      return normalized;
    },
    [perkGraph],
  );

  useEffect(() => {
    if (!isLoaded || didHydrateBuild) {
      return;
    }

    const parsedQuery = queryString.parse(location.search);
    const queryToken =
      typeof parsedQuery[BUILD_QUERY_KEY] === "string"
        ? parsedQuery[BUILD_QUERY_KEY]
        : undefined;
    const buildFromQuery = decodeBuildToken(queryToken);
    const buildFromStorage = parseSavedBuild(
      getStoredItem(PERK_BUILD_STORAGE_KEY) ?? "",
    );
    const initialBuild = buildFromQuery ?? buildFromStorage;

    if (initialBuild != null) {
      setSelectedPerks(normalizeSelection(initialBuild.selectedPerks));

      if (
        initialBuild.activeRoot &&
        logicalRoots.includes(initialBuild.activeRoot)
      ) {
        setActiveRoot(initialBuild.activeRoot);
      }
    }

    setDidHydrateBuild(true);
  }, [
    didHydrateBuild,
    isLoaded,
    location.search,
    logicalRoots,
    normalizeSelection,
  ]);

  useEffect(() => {
    if (activeRoot) {
      return;
    }

    if (logicalRoots.length > 0) {
      setActiveRoot(logicalRoots[0]);
    }
  }, [activeRoot, logicalRoots]);

  const savedBuild = useMemo<SavedPerkBuild>(
    () => ({
      activeRoot,
      selectedPerks: [...selectedPerks].sort((left, right) =>
        left.localeCompare(right, "en"),
      ),
    }),
    [activeRoot, selectedPerks],
  );

  useEffect(() => {
    if (!didHydrateBuild) {
      return;
    }

    storeItem(PERK_BUILD_STORAGE_KEY, JSON.stringify(savedBuild));
  }, [didHydrateBuild, savedBuild]);

  const toggleSelection = useCallback(
    (perkName: string) => {
      setSelectedPerks((currentSelection) =>
        togglePerk(perkName, currentSelection, perkGraph),
      );
    },
    [perkGraph],
  );

  const totalCost = useMemo(
    () => computeTotalCost(selectedPerks, perkGraph),
    [perkGraph, selectedPerks],
  );

  const selectedPerkList = useMemo(() => {
    const selectedNames = [...selectedPerks];
    selectedNames.sort((left, right) => left.localeCompare(right, "en"));
    return selectedNames;
  }, [selectedPerks]);

  const shareSearch = useMemo(() => {
    const parsedQuery = queryString.parse(location.search);
    parsedQuery[BUILD_QUERY_KEY] = encodeBuildToken(savedBuild);
    return queryString.stringify(parsedQuery);
  }, [location.search, savedBuild]);

  const shareUrl = useMemo(() => {
    if (typeof globalThis.window === "undefined") {
      return `${location.pathname}?${shareSearch}`;
    }
    return `${globalThis.window.location.origin}${location.pathname}?${shareSearch}`;
  }, [location.pathname, shareSearch]);

  const nextPerkInfo = useMemo(() => {
    const currentCost = totalCost;
    let bestPerkName: string | undefined;
    let bestIncrementalCost: number | undefined;

    for (const perkName of perkGraph.byName.keys()) {
      if (selectedPerks.has(perkName)) {
        continue;
      }

      if (!canSelect(perkName, selectedPerks, perkGraph)) {
        continue;
      }

      const nextSelection = togglePerk(perkName, selectedPerks, perkGraph);
      const nextCost = computeTotalCost(nextSelection, perkGraph);
      const incrementalCost = nextCost - currentCost;

      if (
        bestIncrementalCost == null ||
        incrementalCost < bestIncrementalCost
      ) {
        bestIncrementalCost = incrementalCost;
        bestPerkName = perkName;
      }
    }

    return {
      perkName: bestPerkName,
      incrementalCost: bestIncrementalCost ?? 0,
    };
  }, [perkGraph, selectedPerks, totalCost]);

  const handleShareBuild = useCallback(async () => {
    navigate(`${location.pathname}?${shareSearch}`);

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatusKey(ShareStatusKey.BuildLinkCopied);
    } catch {
      setShareStatusKey(ShareStatusKey.BuildLinkReadyToCopy);
    }
  }, [location.pathname, navigate, shareSearch, shareUrl]);

  const handleResetBuild = useCallback(() => {
    setSelectedPerks(new Set());
    removeStoredBuild();
    setShareStatusKey(ShareStatusKey.BuildReset);

    const parsedQuery = queryString.parse(location.search);
    delete parsedQuery[BUILD_QUERY_KEY];
    const nextSearch = queryString.stringify(parsedQuery);
    navigate(
      nextSearch.length > 0
        ? `${location.pathname}?${nextSearch}`
        : location.pathname,
      { replace: true },
    );
  }, [location.pathname, location.search, navigate]);

  const handleRootTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (logicalRoots.length === 0) {
        return;
      }

      const keyPressed = event.key;
      const isNextKey =
        keyPressed === "ArrowRight" || keyPressed === "ArrowDown";
      const isPrevKey = keyPressed === "ArrowLeft" || keyPressed === "ArrowUp";

      if (!isNextKey && !isPrevKey) {
        return;
      }

      event.preventDefault();
      const delta = isNextKey ? 1 : -1;
      const nextIndex =
        (index + logicalRoots.length + delta) % logicalRoots.length;
      const nextRoot = logicalRoots[nextIndex];
      setActiveRoot(nextRoot);
      rootTabRefs.current[nextIndex]?.focus();
    },
    [logicalRoots],
  );

  if (error != null) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/",
        }}
      />
    );
  }

  if (!isLoaded) {
    return (
      <Fragment>
        <HeaderMeta
          title={t("seo.perksCalculator.title")}
          description={t("seo.perksCalculator.description")}
          canonical={`${getDomain()}/perks`}
          keywords={t("seo.perksCalculator.keywords")}
        />
        <LoadingScreen />
      </Fragment>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <HeaderMeta
        title={t("seo.perksCalculator.title")}
        description={t("seo.perksCalculator.description")}
        canonical={`${getDomain()}/perks`}
        keywords={t("seo.perksCalculator.keywords")}
      />
      <header className="pt-4 pb-3">
        <h1 className="text-3xl font-bold text-white">{t("menu.perks")}</h1>
        <p className="text-gray-300 mt-1">{t("perksCalculator.subtitle")}</p>
      </header>

      <nav className="w-full mb-4" aria-label={t("perksCalculator.aria.roots")}>
        <div
          className="flex border-b border-gray-700 overflow-x-auto"
          role="tablist"
          aria-label={t("perksCalculator.aria.rootsTablist")}
        >
          {logicalRoots.map((rootName, tabIndex) => {
            const isSelected = activeRoot === rootName;
            return (
              <button
                type="button"
                key={rootName}
                ref={(buttonRef) => {
                  rootTabRefs.current[tabIndex] = buttonRef;
                }}
                className={
                  isSelected
                    ? "px-4 py-2 text-white border-b-2 border-blue-500 bg-gray-800 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    : "px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                }
                onClick={() => setActiveRoot(rootName)}
                onKeyDown={(event) => handleRootTabKeyDown(event, tabIndex)}
                aria-selected={isSelected}
                aria-controls="perk-tree-panel"
                role="tab"
                tabIndex={isSelected ? 0 : -1}
              >
                {rootName}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4 pb-8">
        <main id="perk-tree-panel" role="tabpanel" aria-live="polite">
          {activeRoot ? (
            <PerkTree
              activeRoot={activeRoot}
              graph={perkGraph}
              selectedPerks={selectedPerks}
              onTogglePerk={toggleSelection}
            />
          ) : (
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-300">
              {t("perksCalculator.noRoots")}
            </div>
          )}
        </main>

        <aside className="sticky top-4 h-fit rounded-lg border border-gray-700 bg-gray-900 p-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("perksCalculator.summary.title")}
          </h2>
          <div className="space-y-2 mb-4">
            <p className="text-gray-200">
              {t("perksCalculator.summary.totalPoints")}:{" "}
              <span className="text-yellow-300 font-semibold">{totalCost}</span>
            </p>
            <p className="text-gray-200">
              {t("perksCalculator.summary.selectedPerks")}:{" "}
              <span className="text-blue-300 font-semibold">
                {selectedPerkList.length}
              </span>
            </p>
            <p className="text-gray-200">
              {t("perksCalculator.summary.nextIncrementalCost")}:{" "}
              <span className="text-green-300 font-semibold">
                {nextPerkInfo.incrementalCost}
              </span>
            </p>
            {nextPerkInfo.perkName != null && (
              <p className="text-sm text-gray-400">
                {t("perksCalculator.summary.suggested")}:{" "}
                {nextPerkInfo.perkName}
              </p>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              onClick={() => {
                handleShareBuild();
              }}
            >
              {t("perksCalculator.actions.shareBuild")}
            </button>
            <button
              type="button"
              className="flex-1 rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              onClick={handleResetBuild}
            >
              {t("perksCalculator.actions.reset")}
            </button>
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-400" htmlFor="perk-share-link">
              {t("perksCalculator.shareUrl")}
            </label>
            <input
              id="perk-share-link"
              type="text"
              readOnly
              value={shareUrl}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-200"
            />
            <output className="mt-1 text-xs text-gray-400" aria-live="polite">
              {shareStatusKey ? t(shareStatusKey) : ""}
            </output>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="text-md font-semibold text-white mb-2">
              {t("perksCalculator.selected.title")}
            </h3>
            {selectedPerkList.length === 0 ? (
              <p className="text-gray-400 text-sm">
                {t("perksCalculator.selected.empty")}
              </p>
            ) : (
              <ul className="space-y-1 max-h-80 overflow-auto pr-1">
                {selectedPerkList.map((perkName) => (
                  <li key={perkName} className="text-sm text-gray-200">
                    {perkName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PerkCostCalculator;
