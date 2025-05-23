import React, {
  useState,
  useEffect,
  Suspense,
  Fragment,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router";
import { getStoredItem, storeItem } from "@functions/services";
import { useUser } from "@store/userStore";
import LoadingScreen from "@components/LoadingScreen";
import ModalMessage from "@components/ModalMessage";
import Icon from "@components/Icon";
import { getDomain } from "@functions/utils";
import { getLearned, addTech, getUser } from "@functions/requests/users";
import HeaderMeta from "@components/HeaderMeta";
import type { TechItem } from "@ctypes/item";
import { Tree } from "@ctypes/dto/tech";
import { getTechItems } from "@functions/github";

const SkillTreeTab = React.lazy(
  () => import("@components/TechTree/SkillTreeTab"),
);

const TechTree = () => {
  const { t } = useTranslation();
  const { isConnected } = useUser();
  const { tree } = useParams();
  const [items, setItems] = useState<TechItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [tabSelect, setTabSelect] = useState<Tree>(
    tree ? (tree as Tree) : Tree.VITAMINS,
  );
  const [clan, setClan] = useState<number>();
  const [discordId, setDiscordId] = useState<string>();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const updateLearnedTree = useCallback((treeName: string, data: string[]) => {
    const all: Record<string, { nodeState: string }> = {};
    if (data) {
      for (const tech of data) {
        all[tech] = { nodeState: "selected" };
      }
      storeItem(`skills-${treeName}`, JSON.stringify(all));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (tree && tree !== tabSelect) {
          setTabSelect(tree as Tree);
        }

        const fetchedItems = await getTechItems();
        if (!isMounted) {
          return;
        }

        if (fetchedItems) {
          const filteredItems = fetchedItems.filter((it) => it.parent != null);
          setItems(filteredItems);
        }

        if (isConnected) {
          const userData = await getUser();

          if (userData?.clanid) {
            setClan(userData.clanid);
          }

          if (userData?.discordid) {
            setDiscordId(userData.discordid);

            try {
              const response = await getLearned(userData.discordid, tabSelect);
              if (response) {
                updateLearnedTree("Vitamins", response.Vitamins);
                updateLearnedTree("Equipment", response.Equipment);
                updateLearnedTree("Crafting", response.Crafting);
                updateLearnedTree("Construction", response.Construction);
                updateLearnedTree("Walkers", response.Walkers);
              }
            } catch {
              // Silent error
            }
          }
        }

        if (isMounted) {
          setIsLoaded(true);
        }
      } catch {
        setError("errors.apiConnection");
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tree, tabSelect, updateLearnedTree, isConnected]);

  const saveTree = useCallback(async () => {
    if (isSaving || !discordId) {
      return;
    }

    setIsSaving(true);
    const learned: string[] = [];

    try {
      const techSaved = getStoredItem(`skills-${tabSelect}`);

      if (!techSaved) {
        setIsSaving(false);
        return;
      }

      const data = JSON.parse(techSaved);

      for (const item in data) {
        if (data[item].nodeState === "selected") {
          learned.push(item);
        }
      }

      await addTech(discordId, tabSelect, learned);
    } catch {
      setError("errors.apiConnection");
    } finally {
      setIsSaving(false);
    }
  }, [discordId, tabSelect, isSaving]);

  const deleteTree = useCallback(async () => {
    if (isSaving || !discordId) {
      return;
    }

    setIsSaving(true);

    try {
      localStorage.removeItem(`skills-${tabSelect}`);
      sessionStorage.removeItem(`skills-${tabSelect}`);

      await addTech(discordId, tabSelect, []);

      setItems([]);
      setIsLoaded(false);

      const currentTree = tabSelect;
      setTabSelect(Tree.VITAMINS);
      setTimeout(() => setTabSelect(currentTree), 10);
    } catch (err) {
      console.error("Error deleting tech tree:", err);
      setError("errors.apiConnection");
    } finally {
      setIsSaving(false);
    }
  }, [discordId, tabSelect, isSaving]);

  const saveDeleteButtons = useMemo(() => {
    if (!isConnected) {
      return null;
    }

    return (
      <div className="w-full">
        <div className="flex justify-center gap-4 p-4">
          <button
            type="button"
            className={`px-6 py-2 ${isSaving ? "bg-green-500" : "bg-green-600"} text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 flex items-center justify-center min-w-[120px]`}
            onClick={saveTree}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <title>Saving...</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("common.saving")}
              </>
            ) : (
              t("techTree.saveTreeData")
            )}
          </button>
          <button
            type="button"
            className={`px-6 py-2 ${isSaving ? "bg-red-500" : "bg-red-600"} text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 flex items-center justify-center min-w-[120px]`}
            onClick={deleteTree}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>{t("common.deleting")}</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("common.deleting")}
              </>
            ) : (
              t("techTree.deleteTreeData")
            )}
          </button>
        </div>
      </div>
    );
  }, [t, saveTree, deleteTree, isSaving, isConnected]);

  if (error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (!isLoaded) {
    return (
      <Fragment>
        <HeaderMeta
          title="Tech Tree - Stiletto for Last Oasis"
          description="View and control your clan's technology tree"
          canonical={`${getDomain()}/tech`}
          keywords="Last Oasis tech tree, clan technology, skill progression, game advancement, tech skills, Last Oasis progression system"
        />
        <LoadingScreen />
      </Fragment>
    );
  }

  const tabSelected = t(`tech.${tabSelect}`);

  return (
    <div className="container mx-auto px-4">
      <HeaderMeta
        title={`${tabSelected} - ${t("seo.techTree.title")}`}
        description={t("techTree.description")}
        canonical={`${getDomain()}/tech/${tabSelect}`}
        image="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/techtree.jpg"
        keywords={`Last Oasis, ${tabSelected}, tech tree, skills, progression, ${tabSelected} skills, ${tabSelected} tech, game progression, Last Oasis ${tabSelected}, survival game tech`}
      />
      <header>
        <h1 className="sr-only">{`${tabSelected} - ${t("seo.techTree.title")}`}</h1>
      </header>
      <nav className="w-full" aria-label="Tech Tree Navigation">
        <div
          className="flex border-b border-gray-700"
          id="nav-tab"
          role="tablist"
          aria-orientation="horizontal"
        >
          <div className="flex-1">
            <NavLink
              to="/tech/Vitamins"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
              role="tab"
              aria-selected={tabSelect === Tree.VITAMINS}
              aria-controls="vitamins-panel"
            >
              <Icon key="Vitamins" name="Vitamins" width={30} />{" "}
              {t("crafting.vitamins")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              to="/tech/Equipment"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
              role="tab"
              aria-selected={tabSelect === Tree.EQUIPMENT}
              aria-controls="equipment-panel"
            >
              <Icon key="Equipment" name="Equipment" width={30} />{" "}
              {t("crafting.equipment")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              to="/tech/Crafting"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
              role="tab"
              aria-selected={tabSelect === Tree.CRAFTING}
              aria-controls="crafting-panel"
            >
              <Icon key="Crafting" name="Crafting" width={30} />{" "}
              {t("menu.crafting")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              to="/tech/Construction"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
              role="tab"
              aria-selected={tabSelect === Tree.CONSTRUCTION}
              aria-controls="construction-panel"
            >
              <Icon key="Construction" name="Construction" width={30} />{" "}
              {t("crafting.construction")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              to="/tech/Walkers"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
              role="tab"
              aria-selected={tabSelect === Tree.WALKERS}
              aria-controls="walkers-panel"
            >
              <Icon key="Walkers" name="Walkers" width={30} />{" "}
              {t("crafting.walkers")}
            </NavLink>
          </div>
        </div>
      </nav>
      {saveDeleteButtons}
      <Suspense fallback={<LoadingScreen />}>
        <main
          id={`${tabSelect.toLowerCase()}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabSelect.toLowerCase()}-tab`}
        >
          <SkillTreeTab
            treeId={tabSelect}
            title={t(tabSelect)}
            items={items}
            clan={clan}
          />
        </main>
      </Suspense>
    </div>
  );
};

export default TechTree;
