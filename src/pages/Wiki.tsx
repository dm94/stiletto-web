import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const updateRecipes = async () => {
      setIsLoading(true);
      try {
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
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    updateRecipes();
  }, []);

  const searchItems = useCallback(
    (search = searchText, category = categoryFilter) => {
      sendEvent("search", { props: { term: search } });

      let filtered = items;

      if (category && category !== "All") {
        filtered = filtered.filter((item) => item.category === category);
      }

      if (search.trim()) {
        const searchTerms = search.toLowerCase().split(" ").filter(Boolean);

        filtered = filtered.filter((it) => {
          const itemName = t(it.name).toLowerCase();
          return searchTerms.every((term) => itemName.includes(term));
        });
      }

      setFilteredItems(filtered);

      setCurrentPage(1);
      setDisplayedItems(filtered.slice(0, ITEMS_PER_PAGE));
      setHasMore(filtered.length > ITEMS_PER_PAGE);
    },
    [items, searchText, categoryFilter, t],
  );

  useEffect(() => {
    if (location?.search && items.length > 0) {
      const parsed = queryString.parse(location.search);

      if (parsed?.s) {
        searchItems(String(parsed.s), "All");
      }
    } else if (items.length > 0) {
      setFilteredItems(items);
      setDisplayedItems(items.slice(0, ITEMS_PER_PAGE));
      setHasMore(items.length > ITEMS_PER_PAGE);
    }
  }, [location, items, searchItems]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const nextItems = filteredItems.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedItems(nextItems);
    setHasMore(nextItems.length < filteredItems.length);
  }, [filteredItems, currentPage]);

  const showItems = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-full" key="wiki-loading">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
            <div className="p-6 text-center text-gray-300 text-lg">
              {t("common.loading")}
            </div>
          </div>
        </div>
      );
    }

    if (displayedItems.length > 0) {
      return displayedItems.map((item) => (
        <div
          key={`wiki-${item.name}`}
          className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3"
          data-cy="wiki-item"
        >
          <div className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
            <div className="p-4">
              <Ingredient ingredient={item} value={1} />
            </div>
          </div>
        </div>
      ));
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
  }, [displayedItems, isLoading, t]);

  const showCategories = useMemo(() => {
    return categories.map((category) => (
      <option key={`option-${category}`} value={category}>
        {t(category)}
      </option>
    ));
  }, [categories, t]);

  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.currentTarget.value);
    },
    [],
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCategory = e.target.value;
      setCategoryFilter(newCategory);
      searchItems(searchText, newCategory);
    },
    [searchText, searchItems],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        searchItems(searchText, categoryFilter);
      }
    },
    [searchItems, searchText, categoryFilter],
  );

  const handleSearchClick = useCallback(() => {
    searchItems(searchText, categoryFilter);
  }, [searchItems, searchText, categoryFilter]);

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
                  onClick={handleSearchClick}
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
                  {showCategories}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-wrap -m-3">{showItems}</div>
        {hasMore && !isLoading && displayedItems.length > 0 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              onClick={handleLoadMore}
              data-cy="load-more-btn"
            >
              {t("common.loadMore")}
            </button>
          </div>
        )}
        {!isLoading && displayedItems.length > 0 && (
          <div className="mt-4 text-center text-gray-400">
            {t("wiki.showingItems", {
              displayed: displayedItems.length,
              total: filteredItems.length,
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wiki;
