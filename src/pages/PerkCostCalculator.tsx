import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPerks } from "@functions/github";
import {
  buildPerkGraph,
  canSelect,
  computeTotalCost,
  togglePerk,
} from "@functions/perkCostEngine";
import type { Perk } from "@ctypes/perk";
import HeaderMeta from "@components/HeaderMeta";
import LoadingScreen from "@components/LoadingScreen";
import ModalMessage from "@components/ModalMessage";
import PerkTree from "@components/Perks/PerkTree";
import { getDomain } from "@functions/utils";

const PerkCostCalculator = () => {
  const { t } = useTranslation();
  const [perks, setPerks] = useState<Perk[]>([]);
  const [selectedPerks, setSelectedPerks] = useState<Set<string>>(new Set());
  const [activeRoot, setActiveRoot] = useState<string>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>();

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
      [...perkGraph.roots].sort((left, right) => left.localeCompare(right, "en")),
    [perkGraph.roots],
  );

  useEffect(() => {
    if (activeRoot != null) {
      return;
    }

    if (logicalRoots.length > 0) {
      setActiveRoot(logicalRoots[0]);
    }
  }, [activeRoot, logicalRoots]);

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

  const nextPerkInfo = useMemo(() => {
    const currentCost = computeTotalCost(selectedPerks, perkGraph);
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

      if (bestIncrementalCost == null || incrementalCost < bestIncrementalCost) {
        bestIncrementalCost = incrementalCost;
        bestPerkName = perkName;
      }
    }

    return {
      perkName: bestPerkName,
      incrementalCost: bestIncrementalCost ?? 0,
    };
  }, [perkGraph, selectedPerks]);

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
          title="Perk Cost Calculator - Stiletto"
          description="Build and plan your Last Oasis perk trees with automatic parent dependencies and real-time point totals."
          canonical={`${getDomain()}/perks`}
          keywords="Last Oasis perks, perk tree, perks calculator, points planner, stiletto perks"
        />
        <LoadingScreen />
      </Fragment>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <HeaderMeta
        title="Perk Cost Calculator - Stiletto"
        description="Build and plan your Last Oasis perk trees with automatic parent dependencies and real-time point totals."
        canonical={`${getDomain()}/perks`}
        keywords="Last Oasis perks, perk tree, perks calculator, points planner, stiletto perks"
      />
      <header className="pt-4 pb-3">
        <h1 className="text-3xl font-bold text-white">{t("menu.perks")}</h1>
        <p className="text-gray-300 mt-1">
          Plan your perk trees with automatic dependency selection.
        </p>
      </header>

      <nav className="w-full mb-4" aria-label="Perk tree roots">
        <div className="flex border-b border-gray-700 overflow-x-auto">
          {logicalRoots.map((rootName) => {
            const isSelected = activeRoot === rootName;
            return (
              <button
                type="button"
                key={rootName}
                className={
                  isSelected
                    ? "px-4 py-2 text-white border-b-2 border-blue-500 bg-gray-800 whitespace-nowrap"
                    : "px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent whitespace-nowrap"
                }
                onClick={() => setActiveRoot(rootName)}
                aria-pressed={isSelected}
              >
                {rootName}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4 pb-8">
        <main>
          {activeRoot != null ? (
            <PerkTree
              activeRoot={activeRoot}
              graph={perkGraph}
              selectedPerks={selectedPerks}
              onTogglePerk={toggleSelection}
            />
          ) : (
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-gray-300">
              No perk roots available.
            </div>
          )}
        </main>

        <aside className="sticky top-4 h-fit rounded-lg border border-gray-700 bg-gray-900 p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Build summary</h2>
          <div className="space-y-2 mb-4">
            <p className="text-gray-200">
              Total points:{" "}
              <span className="text-yellow-300 font-semibold">{totalCost}</span>
            </p>
            <p className="text-gray-200">
              Selected perks:{" "}
              <span className="text-blue-300 font-semibold">
                {selectedPerkList.length}
              </span>
            </p>
            <p className="text-gray-200">
              Next incremental cost:{" "}
              <span className="text-green-300 font-semibold">
                {nextPerkInfo.incrementalCost}
              </span>
            </p>
            {nextPerkInfo.perkName != null && (
              <p className="text-sm text-gray-400">Suggested: {nextPerkInfo.perkName}</p>
            )}
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="text-md font-semibold text-white mb-2">Selected perks</h3>
            {selectedPerkList.length === 0 ? (
              <p className="text-gray-400 text-sm">No perks selected yet.</p>
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
