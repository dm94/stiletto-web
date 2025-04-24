import type React from "react";
import { useState, useEffect, useCallback } from "react";
import "../styles/loader-small.css";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import { getItems, getCreatures } from "@functions/github";
import { sendEvent } from "@functions/page-tracking";
import { getDomain } from "@functions/utils";
import HeaderMeta from "@components/HeaderMeta";
import { useLocation, useNavigate } from "react-router";
import type { Item } from "@ctypes/item";
import type { Creature } from "@ctypes/creature";

import ContentTypeSelector from "@components/Wiki/ContentTypeSelector";
import SearchBar from "@components/Wiki/SearchBar";
import CategoryFilter from "@components/Wiki/CategoryFilter";
import WikiContent from "@components/Wiki/WikiContent";
import Pagination from "@components/Wiki/Pagination";

const Wiki = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  // Extract categories from data items
  const extractCategories = <T extends { category?: string }>(
    data: T[],
  ): string[] => {
    const allCategories: string[] = [];

    for (const item of data) {
      if (item.category && !allCategories.includes(item.category)) {
        allCategories.push(item.category);
      }
    }

    return allCategories.sort((a, b) => a.localeCompare(b));
  };

  // Update state with fetched items data
  const processItemsData = (fetchedItems: Item[]) => {
    const allCategories = extractCategories(fetchedItems);

    setItems(fetchedItems);
    setCategories(allCategories);
    setFilteredItems(fetchedItems);
    setDisplayedItems(fetchedItems.slice(0, ITEMS_PER_PAGE));
    setHasMore(fetchedItems.length > ITEMS_PER_PAGE);
  };

  // Update state with fetched creatures data
  const processCreaturesData = (fetchedCreatures: Creature[]) => {
    const allCategories = extractCategories(fetchedCreatures);

    setCreatures(fetchedCreatures);
    setCategories(allCategories);
    setFilteredCreatures(fetchedCreatures);
    setDisplayedCreatures(fetchedCreatures.slice(0, ITEMS_PER_PAGE));
    setHasMore(fetchedCreatures.length > ITEMS_PER_PAGE);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (contentType === "items") {
          const fetchedItems = await getItems();
          if (fetchedItems != null) {
            processItemsData(fetchedItems);
          }
        } else {
          const fetchedCreatures = await getCreatures();
          if (fetchedCreatures != null) {
            processCreaturesData(fetchedCreatures);
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

      if (
        parsed?.type &&
        (parsed.type === "items" || parsed.type === "creatures")
      ) {
        setContentType(parsed.type);
      }

      // Read the category parameter from URL
      if (parsed?.category && typeof parsed.category === "string") {
        setCategoryFilter(parsed.category);
      }

      if (parsed?.s) {
        // Use the category from URL if available, or "All" if not
        const categoryToUse = parsed?.category
          ? String(parsed.category)
          : "All";
        searchContent(String(parsed.s), categoryToUse);
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

      const searchParams = new URLSearchParams();
      if (searchText.trim()) {
        searchParams.set("s", searchText);
      }
      // Preserve the 'type' parameter in the URL
      searchParams.set("type", contentType);
      // Add the 'category' parameter to the URL if it's not "All"
      if (newCategory !== "All") {
        searchParams.set("category", newCategory);
      }
      navigate(`/wiki?${searchParams.toString()}`);
    },
    [searchText, searchContent, navigate, contentType],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        searchContent(searchText, categoryFilter);

        const searchParams = new URLSearchParams();
        if (searchText.trim()) {
          searchParams.set("s", searchText);
        }
        // Preserve the 'type' parameter in the URL
        searchParams.set("type", contentType);
        // Add the 'category' parameter to the URL if it's not "All"
        if (categoryFilter !== "All") {
          searchParams.set("category", categoryFilter);
        }
        navigate(`/wiki?${searchParams.toString()}`);
      }
    },
    [searchContent, searchText, categoryFilter, navigate, contentType],
  );

  const handleSearchClick = useCallback(() => {
    searchContent(searchText, categoryFilter);

    const searchParams = new URLSearchParams();
    if (searchText.trim()) {
      searchParams.set("s", searchText);
    }
    // Preserve the 'type' parameter in the URL
    searchParams.set("type", contentType);
    // Add the 'category' parameter to the URL if it's not "All"
    if (categoryFilter !== "All") {
      searchParams.set("category", categoryFilter);
    }
    navigate(`/wiki?${searchParams.toString()}`);
  }, [searchContent, searchText, categoryFilter, navigate, contentType]);

  const handleContentTypeChange = useCallback(
    (type: "items" | "creatures") => {
      setContentType(type);
      setSearchText("");
      setCategoryFilter("All");
      setCurrentPage(1);

      // Add the 'type' parameter to the URL
      const searchParams = new URLSearchParams();
      searchParams.set("type", type);
      // We don't include the 'category' parameter since it resets to "All"
      navigate(`/wiki?${searchParams.toString()}`);
    },
    [navigate],
  );

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
            <ContentTypeSelector
              contentType={contentType}
              onContentTypeChange={handleContentTypeChange}
            />

            {/* Search Bar */}
            <SearchBar
              searchText={searchText}
              onSearchTextChange={handleSearchTextChange}
              onKeyPress={handleKeyPress}
              onSearchClick={handleSearchClick}
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              categoryFilter={categoryFilter}
              onCategoryChange={handleCategoryChange}
            />
          )}
        </div>
      </div>
      <div className="w-full">
        {/* Wiki Content */}
        <WikiContent
          contentType={contentType}
          isLoading={isLoading}
          displayedItems={displayedItems}
          displayedCreatures={displayedCreatures}
        />

        {/* Pagination */}
        <Pagination
          contentType={contentType}
          isLoading={isLoading}
          hasMore={hasMore}
          displayedItems={displayedItems}
          displayedCreatures={displayedCreatures}
          filteredItems={filteredItems}
          filteredCreatures={filteredCreatures}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default Wiki;
