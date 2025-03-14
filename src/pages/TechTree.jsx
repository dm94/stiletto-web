import React, { useState, useEffect, Suspense, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useParams } from "react-router";
import {
  getItems,
  getUserProfile,
  getStoredItem,
  storeItem,
} from "../functions/services";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import Icon from "../components/Icon";
import DoubleScrollbar from "../components/TechTree/DoubleScrollbar";
import { getDomain } from "../functions/utils";
import { getLearned, addTech } from "../functions/requests/users";
import HeaderMeta from "../components/HeaderMeta";

const SkillTreeTab = React.lazy(
  () => import("../components/TechTree/SkillTreeTab"),
);

const TechTree = () => {
  const { t } = useTranslation();
  const { tree } = useParams();
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [tabSelect, setTabSelect] = useState(tree || "Vitamins");
  const [clan, setClan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (getStoredItem("token") != null) {
        try {
          const data = await getUserProfile();
          setClan(data.message.clanid);

          const response = await getLearned();
          if (response.data) {
            updateLearnedTree("Vitamins", response.data.Vitamins);
            updateLearnedTree("Equipment", response.data.Equipment);
            updateLearnedTree("Crafting", response.data.Crafting);
            updateLearnedTree("Construction", response.data.Construction);
            updateLearnedTree("Walkers", response.data.Walkers);
          }
        } catch (err) {
          setError(err);
        }
      }

      if (tree) {
        setTabSelect(tree);
      }

      let fetchedItems = await getItems();
      if (fetchedItems) {
        fetchedItems = fetchedItems.filter((it) => it.parent != null);
        setItems(fetchedItems);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [tree]);

  const updateLearnedTree = (treeName, data) => {
    const all = {};
    if (data) {
      for (const tech of data) {
        all[tech] = { optional: false, nodeState: "selected" };
      }
      storeItem(`skills-${treeName}`, JSON.stringify(all));
    }
  };

  const saveTree = async () => {
    const learned = [];
    try {
      const data = JSON.parse(getStoredItem(`skills-${tabSelect}`));

      for (const item in data) {
        if (data[item].nodeState === "selected") {
          learned.push(item);
        }
      }
    } catch (err) {
      console.error(err);
    }

    try {
      await addTech(tabSelect, learned);
    } catch (err) {
      setError(err);
    }
  };

  const deleteTree = async () => {
    try {
      localStorage.removeItem(`skills-${tabSelect}`);
      sessionStorage.removeItem(`skills-${tabSelect}`);
      await addTech(tabSelect, []);
    } catch (err) {
      setError(err);
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
              {t("Save Tree Data")}
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={deleteTree}
            >
              {t("Delete Tree Data")}
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
              className="flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              to="/tech/Vitamins"
              activeClassName="text-white border-blue-500"
            >
              <Icon key="Vitamins" name="Vitamins" width={30} /> {t("Vitamins")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              className="flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              to="/tech/Equipment"
              activeClassName="text-white border-blue-500"
            >
              <Icon key="Equipment" name="Equipment" width={30} />{" "}
              {t("Equipment")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              className="flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              to="/tech/Crafting"
              activeClassName="text-white border-blue-500"
            >
              <Icon key="Crafting" name="Crafting" width={30} /> {t("Crafting")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              className="flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              to="/tech/Construction"
              activeClassName="text-white border-blue-500"
            >
              <Icon key="Construction" name="Construction" width={30} />{" "}
              {t("Construction")}
            </NavLink>
          </div>
          <div className="flex-1">
            <NavLink
              className="flex items-center justify-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 border-b-2 border-transparent hover:border-blue-500"
              to="/tech/Walkers"
              activeClassName="text-white border-blue-500"
            >
              <Icon key="Walkers" name="Walkers" width={30} /> {t("Walkers")}
            </NavLink>
          </div>
        </div>
      </nav>
      {saveDeleteButtons()}
      <DoubleScrollbar className="w-full">
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
