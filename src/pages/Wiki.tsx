import type React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import { getItems } from "../functions/services";
import { sendEvent } from "../page-tracking";
import Ingredient from "../components/Ingredient";
import { getDomain } from "../functions/utils";
import HeaderMeta from "../components/HeaderMeta";
import { useLocation } from "react-router";
import type { Item } from "../types/item";

const Wiki = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  useEffect(() => {
    const updateRecipes = async () => {
      const fetchedItems = await getItems();
      if (fetchedItems != null) {
        const allCategories: string[] = [];

        for (const item of fetchedItems) {
          if (item.category && !allCategories.includes(item.category)) {
            allCategories.push(item.category);
          }
        }

        allCategories.sort((a, b) => a.localeCompare(b));

        setItems(fetchedItems);
        setCategories(allCategories);
      }
    };

    updateRecipes();

    if (location?.search) {
      const parsed = queryString.parse(location.search);

      if (parsed?.s) {
        setSearchText(String(parsed.s));
        searchItems(String(parsed.s), "All");
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
      return filteredItems.map((item) => {
        const url = `${getDomain()}/item/${encodeURI(
          item?.name.toLowerCase().replaceAll(" ", "_"),
        )}`;

        return (
          <a
            href={url}
            key={`wiki-${item.name}`}
            className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3"
            data-cy="wiki-item"
          >
            <div className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
              <div className="p-4">
                <Ingredient ingredient={item} value={1} />
              </div>
            </div>
          </a>
        );
      });
    }

    return (
      <div className="w-full" key="wiki-notfound">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
          <div className="p-6 text-center text-gray-300 text-lg">
            {t("wiki.nothingFound")}
          </div>
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

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.currentTarget.value);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    searchItems(searchText, e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchItems();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderMeta
        title="Wiki - Stiletto for Last Oasis"
        description="Last oasis Wiki"
        cannonical={`${getDomain()}/wiki`}
      />
      <div className="w-full mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              {t("menu.wiki")}
            </h1>
            <div className="max-w-2xl mx-auto">
              <div
                className="flex"
                itemProp="potentialAction"
                data-cy="wiki-search"
              >
                <input
                  type="search"
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("common.search")}
                  aria-label={t("common.search")}
                  onChange={handleSearchTextChange}
                  onKeyDown={handleKeyPress}
                  value={searchText}
                />
                <button
                  type="button"
                  className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  onClick={() => searchItems()}
                >
                  {t("common.search")}
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-700 bg-gray-850">
            <div className="max-w-md mx-auto">
              <div className="flex">
                <label
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg text-gray-300"
                  htmlFor="category-filter"
                >
                  {t("wiki.filterByCategory")}
                </label>
                <select
                  id="category-filter"
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-r-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                >
                  <option key="all" value="All">
                    {t("common.all")}
                  </option>
                  {showCategories()}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-wrap -m-3">{showItems()}</div>
      </div>
    </div>
  );
};

export default Wiki;
