import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import { getItems } from "../functions/services";
import { sendEvent } from "../page-tracking";
import Ingredient from "../components/Ingredient";
import { getDomain } from "../functions/utils";
import HeaderMeta from "../components/HeaderMeta";

const Wiki = ({ location }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const updateRecipes = async () => {
      const fetchedItems = await getItems();
      if (fetchedItems != null) {
        const allCategories = [];

        for (const item of fetchedItems) {
          if (item.category && !allCategories.includes(item.category)) {
            allCategories.push(item.category);
          }
        }

        allCategories.sort();

        setItems(fetchedItems);
        setCategories(allCategories);
      }
    };

    updateRecipes();

    if (location?.search) {
      const parsed = queryString.parse(location.search);

      if (parsed?.s) {
        setSearchText(parsed.s);
        searchItems(parsed.s, "All");
      }
    }
  }, [location]);

  const searchItems = (search = searchText, category = categoryFilter) => {
    sendEvent("search", { props: { term: search } });

    let filtered = items;

    if (category && category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }

    filtered = filtered.filter((it) => {
      const itemF = t(it.name).toLowerCase();

      return search
        .split(" ")
        .every((term) => itemF.includes(term.toLowerCase()));
    });

    setFilteredItems(filtered);
  };

  const showItems = () => {
    if (filteredItems.length > 0) {
      return filteredItems.map((item) => (
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2" key={`wiki-${item.name}`}>
          <Ingredient ingredient={item} value={1} />
        </div>
      ));
    }

    return (
      <div className="w-full" key="wiki-notfound">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 text-center text-gray-300">{t("Nothing found")}</div>
        </div>
      </div>
    );
  };

  const showCategories = () => {
    return categories.map((category) => (
      <option key={`option-${category}`} value={category}>
        {t(category)}
      </option>
    ));
  };

  const handleSearchTextChange = (e) => setSearchText(e.currentTarget.value);

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    searchItems(searchText, e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchItems();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <HeaderMeta
        title="Wiki - Stiletto for Last Oasis"
        description="Last oasis Wiki"
        cannonical={`${getDomain()}/wiki`}
      />
      <div className="w-full mb-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div
                className="flex"
                itemProp="potentialAction"
                data-cy="wiki-search"
              >
                <input
                  type="search"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("Search")}
                  aria-label={t("Search")}
                  onChange={handleSearchTextChange}
                  onKeyDown={handleKeyPress}
                  value={searchText}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => searchItems()}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="max-w-md">
              <div className="flex">
                <label className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-gray-300" htmlFor="category-filter">
                  {t("Filter by category")}
                </label>
                <select
                  id="category-filter"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-r-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                >
                  <option key="all" value="All">
                    {t("All")}
                  </option>
                  {showCategories()}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-wrap -m-2">{showItems()}</div>
      </div>
    </div>
  );
};

export default Wiki;
