import React, { useState, useEffect, Suspense, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router";
import {
  getItems,
  getStoredItem,
  storeItem,
} from "../functions/services";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import Icon from "../components/Icon";
import DoubleScrollbar from "../components/TechTree/DoubleScrollbar";
import { getDomain } from "../functions/utils";
import { getLearned, addTech, getUser } from "../functions/requests/users";
import HeaderMeta from "../components/HeaderMeta";
import type { Item } from "../types/item";
import { Tree } from "../types/dto/tech";

const SkillTreeTab = React.lazy(
  () => import("../components/TechTree/SkillTreeTab"),
);

const TechTree = () => {
  const { t } = useTranslation();
  const { tree } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [tabSelect, setTabSelect] = useState<Tree>(tree ? tree as Tree :  Tree.VITAMINS);
  const [clan, setClan] = useState<number>();
  const [discordId, setdiscordId] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      if (getStoredItem("token") != null) {
        try {
          const data = await getUser();
          if (data?.clanid) {
            setClan(data.clanid);
          }

          if (data?.discordid) {
            setdiscordId(data.discordid);
          }

          const response = await getLearned(data.discordid, tabSelect);
          if (response) {
            updateLearnedTree("Vitamins", response.Vitamins);
            updateLearnedTree("Equipment", response.Equipment);
            updateLearnedTree("Crafting", response.Crafting);
            updateLearnedTree("Construction", response.Construction);
            updateLearnedTree("Walkers", response.Walkers);
          }
        } catch {
          setError("errors.apiConnection");
        }
      }

      if (tree) {
        setTabSelect(tree as Tree);
      }

      let fetchedItems = await getItems();
      if (fetchedItems) {
        fetchedItems = fetchedItems.filter((it) => it.parent != null);
        setItems(fetchedItems);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [tree, tabSelect]);

  const updateLearnedTree = (treeName: string, data: any) => {
    const all: Record<string, { optional: boolean; nodeState: string }> = {};
    if (data) {
      for (const tech of data) {
        all[tech] = { optional: false, nodeState: "selected" };
      }
      storeItem(`skills-${treeName}`, JSON.stringify(all));
    }
  };

  const saveTree = async () => {
    const learned: string[] = [];
    try {
      const techSaved = getStoredItem(`skills-${tabSelect}`);

      if (!techSaved) {
        return;
      }

      const data = JSON.parse(techSaved);

      for (const item in data) {
        if (data[item].nodeState === "selected") {
          learned.push(item);
        }
      }
    } catch (err) {
      console.error(err);
    }

    if (!discordId) {
      return;
    }

    try {
      await addTech(discordId, tabSelect, learned);
    } catch {
      setError("errors.apiConnection");
    }
  };

  const deleteTree = async () => {
    try {
      localStorage.removeItem(`skills-${tabSelect}`);
      sessionStorage.removeItem(`skills-${tabSelect}`);

      if (discordId) {
        await addTech(discordId, tabSelect, []);
      }
    } catch {
      setError("errors.apiConnection");
    }
    window.location.reload();
  };

  const saveDeleteButtons = () => {
    if (getStoredItem("token") != null) {
      return (
        <div className="w-full">
          <div className="flex justify-center gap-4 p-4">
            <button
              type="button"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={saveTree}
            >
              {t("techTree.saveTreeData")}
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={deleteTree}
            >
              {t("techTree.deleteTreeData")}
            </button>
          </div>
        </div>
      );
    }
    return "";
  };

  const theme = {
    h1FontSize: "50",
    border: "1px solid rgb(127,127,127)",
    treeBackgroundColor: "rgba(60, 60, 60, 0.9)",
    nodeBackgroundColor: "rgba(10, 10, 10, 0.3)",
    nodeAlternativeActiveBackgroundColor: "#834AC4",
    nodeActiveBackgroundColor: "#834AC4",
    nodeBorderColor: "#834AC4",
    nodeHoverBorderColor: "#834AC4",
  };

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
            <NavLink
              to="/tech/Vitamins"
              className={({ isActive }) =>
                isActive ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500" : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Vitamins" name="Vitamins" width={30} />{" "}
              {t("common.vitamins")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              to="/tech/Equipment"
              className={({ isActive }) =>
                isActive ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500" : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Equipment" name="Equipment" width={30} />{" "}
              {t("common.equipment")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink              to="/tech/Crafting"
              className={({ isActive }) =>
                isActive ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500" : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Crafting" name="Crafting" width={30} />{" "}
              {t("menu.crafting")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              to="/tech/Construction"
              className={({ isActive }) =>
                isActive ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500" : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Construction" name="Construction" width={30} />{" "}
              {t("common.construction")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              to="/tech/Walkers"
              className={({ isActive }) =>
                isActive ? "flex items-center justify-center px-4 py-2 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500 text-white border-blue-500" : "flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              }
            >
              <Icon key="Walkers" name="Walkers" width={30} />{" "}
              {t("common.walkers")}
            </NavLink>
          </div>
        </div>
      </nav>
      {saveDeleteButtons()}
      <DoubleScrollbar>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <Suspense fallback={<LoadingScreen />}>
            <SkillTreeTab
              treeId={tabSelect}
              title={t(tabSelect)}
              theme={theme}
              items={items}
              clan={clan}
            />
          </Suspense>
        </div>
      </DoubleScrollbar>
    </div>
  );
};

export default TechTree;
