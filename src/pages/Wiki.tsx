import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import "../styles/loader-small.css";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import { getItems, getCreatures } from "@functions/github";
import { sendEvent } from "@functions/page-tracking";
import Ingredient from "@components/Ingredient";
import { getCreatureUrl, getDomain } from "@functions/utils";
import HeaderMeta from "@components/HeaderMeta";
import { useLocation, Link } from "react-router";
import type { Item } from "@ctypes/item";
import type { Creature } from "@ctypes/creature";
import Icon from "@components/Icon";

const Wiki = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [contentType, setContentType] = useState<"items" | "creatures">(
    "items",
  );

  // Items state
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);

  // Creatures state
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [filteredCreatures, setFilteredCreatures] = useState<Creature[]>([]);
  const [displayedCreatures, setDisplayedCreatures] = useState<Creature[]>([]);

  // Common state
  const [searchText, setSearchText] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (contentType === "items") {
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
            setFilteredItems(fetchedItems);
            setDisplayedItems(fetchedItems.slice(0, ITEMS_PER_PAGE));
            setHasMore(fetchedItems.length > ITEMS_PER_PAGE);
          }
        } else {
          const fetchedCreatures = await getCreatures();
          if (fetchedCreatures != null) {
            const allCategories: string[] = [];

            for (const creature of fetchedCreatures) {
              if (
                creature?.category &&
                !allCategories.includes(creature.category)
              ) {
                allCategories.push(creature.category);
              }
            }

            allCategories.sort((a, b) => a.localeCompare(b));

            setCreatures(fetchedCreatures);
            setCategories(allCategories);
            setFilteredCreatures(fetchedCreatures);
            setDisplayedCreatures(fetchedCreatures.slice(0, ITEMS_PER_PAGE));
            setHasMore(fetchedCreatures.length > ITEMS_PER_PAGE);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [contentType]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const searchContent = useCallback(
    (search = searchText, category = categoryFilter) => {
      sendEvent("search", { props: { term: search } });

      if (contentType === "items") {
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
      } else {
        let filtered = creatures;

        if (category && category !== "All") {
          filtered = filtered.filter(
            (creature) => creature.category === category,
          );
        }

        if (search.trim()) {
          const searchTerms = search.toLowerCase().split(" ").filter(Boolean);

          filtered = filtered.filter((cr) => {
            const creatureName = t(cr.name, { ns: "creatures" }).toLowerCase();
            return searchTerms.every((term) => creatureName.includes(term));
          });
        }

        setFilteredCreatures(filtered);
        setCurrentPage(1);
        setDisplayedCreatures(filtered.slice(0, ITEMS_PER_PAGE));
        setHasMore(filtered.length > ITEMS_PER_PAGE);
      }
    },
    [items, creatures, searchText, t, contentType],
  );

  useEffect(() => {
    if (location?.search) {
      const parsed = queryString.parse(location.search);

      if (parsed?.s) {
        searchContent(String(parsed.s), "All");
      }
    }
  }, [location, searchContent]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    if (contentType === "items") {
      const nextItems = filteredItems.slice(0, nextPage * ITEMS_PER_PAGE);
      setDisplayedItems(nextItems);
      setHasMore(nextItems.length < filteredItems.length);
    } else {
      const nextCreatures = filteredCreatures.slice(
        0,
        nextPage * ITEMS_PER_PAGE,
      );
      setDisplayedCreatures(nextCreatures);
      setHasMore(nextCreatures.length < filteredCreatures.length);
    }
  }, [filteredItems, filteredCreatures, currentPage, contentType]);

  const showContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-full" key="wiki-loading">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
            <div className="p-6 text-center text-gray-300 text-lg relative">
              <div className="loader-small" />
            </div>
          </div>
        </div>
      );
    }

    if (contentType === "items" && displayedItems.length > 0) {
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

    if (contentType === "creatures" && displayedCreatures.length > 0) {
      return displayedCreatures.map((creature) => (
        <div
          key={`creature-${creature.name}`}
          className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3"
          data-cy="wiki-creature"
        >
          <Link to={getCreatureUrl(creature.name)}>
            <div className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
              <div className="p-4 flex items-center">
                <Icon key={creature.name} name={creature.name} width={35} />
                <span className="ml-2 text-gray-300">
                  {t(creature.name, { ns: "creatures" })}
                </span>
              </div>
            </div>
          </Link>
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
  }, [displayedItems, displayedCreatures, isLoading, t, contentType]);

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
      searchContent(searchText, newCategory);
    },
    [searchText, searchContent],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        searchContent(searchText, categoryFilter);
      }
    },
    [searchContent, searchText, categoryFilter],
  );

  const handleSearchClick = useCallback(() => {
    searchContent(searchText, categoryFilter);
  }, [searchContent, searchText, categoryFilter]);

  const handleContentTypeChange = useCallback((type: "items" | "creatures") => {
    setContentType(type);
    setSearchText("");
    setCategoryFilter("All");
    setCurrentPage(1);
  }, []);

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

            {/* Content Type Selector */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${contentType === "items" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                  onClick={() => handleContentTypeChange("items")}
                >
                  {t("menu.items")}
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${contentType === "creatures" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                  onClick={() => handleContentTypeChange("creatures")}
                >
                  {t("menu.creatures")}
                </button>
              </div>
            </div>

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
          {categories.length > 0 && (
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
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-wrap -m-3">{showContent}</div>
        {hasMore &&
          !isLoading &&
          ((contentType === "items" && displayedItems.length > 0) ||
            (contentType === "creatures" && displayedCreatures.length > 0)) && (
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
        {!isLoading &&
          (contentType === "items" && displayedItems.length > 0 ? (
            <div className="mt-4 text-center text-gray-400">
              {t("wiki.showingItems", {
                displayed: displayedItems.length,
                total: filteredItems.length,
              })}
            </div>
          ) : (
            contentType === "creatures" &&
            displayedCreatures.length > 0 && (
              <div className="mt-4 text-center text-gray-400">
                {t("wiki.showingItems", {
                  displayed: displayedCreatures.length,
                  total: filteredCreatures.length,
                })}
              </div>
            )
          ))}
      </div>
    </div>
  );
};

export default Wiki;
