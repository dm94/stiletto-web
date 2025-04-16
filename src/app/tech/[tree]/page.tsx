"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  Fragment,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { getItems, getStoredItem, storeItem } from "@functions/services";
import LoadingScreen from "@components/LoadingScreen";
import ModalMessage from "@components/ModalMessage";
import Icon from "@components/Icon";
import { getDomain } from "@functions/utils";
import { getLearned, addTech, getUser } from "@functions/requests/users";
import HeaderMeta from "@components/HeaderMeta";
import type { Item } from "@ctypes/item";
import { Tree } from "@ctypes/dto/tech";
import { useParams } from "next/navigation";
import Link from "next/link";

const SkillTreeTab = React.lazy(
  () => import("@components/TechTree/SkillTreeTab"),
);

const TechTree = () => {
  const { t } = useTranslation();
  const { tree } = useParams();
  const [items, setItems] = useState<Item[]>([]);
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

        const fetchedItems = await getItems();
        if (!isMounted) {
          return;
        }

        if (fetchedItems) {
          const filteredItems = fetchedItems.filter((it) => it.parent != null);
          setItems(filteredItems);
        }

        const token = getStoredItem("token");
        if (token) {
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
  }, [tree, tabSelect, updateLearnedTree]);

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
    if (getStoredItem("token") == null) {
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
                {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
  }, [t, saveTree, deleteTree, isSaving]);

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
          cannonical={`${getDomain()}/tech`}
        />
        <LoadingScreen />
      </Fragment>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <HeaderMeta
        title="Tech Tree - Stiletto for Last Oasis"
        description="View and control your clan's technology tree"
        cannonical={`${getDomain()}/tech`}
      />
      <nav className="w-full">
        <div
          className="flex border-b border-gray-700"
          id="nav-tab"
          role="tablist"
        >
          <div className="flex-1">
            <Link
              href="/tech/Vitamins"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Vitamins" name="Vitamins" width={30} />{" "}
              {t("crafting.vitamins")}
            </Link>
          </div>
          <div className="flex-1">
            <Link
              href="/tech/Equipment"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Equipment" name="Equipment" width={30} />{" "}
              {t("crafting.equipment")}
            </Link>
          </div>
          <div className="flex-1">
            <Link
              href="/tech/Crafting"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Crafting" name="Crafting" width={30} />{" "}
              {t("menu.crafting")}
            </Link>
          </div>
          <div className="flex-1">
            <Link
              href="/tech/Construction"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Construction" name="Construction" width={30} />{" "}
              {t("crafting.construction")}
            </Link>
          </div>
          <div className="flex-1">
            <Link
              href="/tech/Walkers"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500"
                  : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Walkers" name="Walkers" width={30} />{" "}
              {t("crafting.walkers")}
            </Link>
          </div>
        </div>
      </nav>
      {saveDeleteButtons}
      <Suspense fallback={<LoadingScreen />}>
        <SkillTreeTab
          treeId={tabSelect}
          title={t(tabSelect)}
          items={items}
          clan={clan}
        />
      </Suspense>
    </div>
  );
};

export default TechTree;
