"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import "../styles/loader-small.css";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import {
  getItems,
  getCreatures,
  getPerks,
  getWikiLastUpdate,
} from "@functions/github";
import { AnalyticsEvent, sendEvent } from "@functions/page-tracking";
import { getCreatureUrl, getDomain, getItemUrl } from "@functions/utils";
import HeaderMeta from "@components/HeaderMeta";
import { useRouter, useSearchParams } from "next/navigation";
import type { Item } from "@ctypes/item";
import type { Creature } from "@ctypes/creature";
import type { Perk } from "@ctypes/perk";

import ContentTypeSelector from "@components/Wiki/ContentTypeSelector";
import SearchBar from "@components/Wiki/SearchBar";
import CategoryFilter from "@components/Wiki/CategoryFilter";
import WikiContent from "@components/Wiki/WikiContent";
import Pagination from "@components/Wiki/Pagination";
import { useLanguagePrefix } from "@hooks/useLanguagePrefix";

type WikiContentType = "items" | "creatures" | "perks";

type WikiProps = {
  initialItems?: Item[];
  initialCreatures?: Creature[];
  initialPerks?: Perk[];
  initialWikiLastUpdate?: string;
};

const Wiki: React.FC<WikiProps> = ({
  initialItems,
  initialCreatures,
  initialPerks,
  initialWikiLastUpdate,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getLanguagePrefixedPath } = useLanguagePrefix();
  const { t, i18n } = useTranslation();
  const domain = getDomain();
  const wikiCanonical = `${domain}/wiki`;
  const wikiDescription = t("seo.wiki.description");
  const [contentType, setContentType] = useState<WikiContentType>("items");
  const [wikiLastUpdate, setWikiLastUpdate] = useState<string | undefined>(
    initialWikiLastUpdate,
  );

  // Items state
  const [items, setItems] = useState<Item[]>(initialItems ?? []);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);

  // Creatures state
  const [creatures, setCreatures] = useState<Creature[]>(
    initialCreatures ?? [],
  );
  const [filteredCreatures, setFilteredCreatures] = useState<Creature[]>([]);
  const [displayedCreatures, setDisplayedCreatures] = useState<Creature[]>([]);

  // Perks state
  const [perks, setPerks] = useState<Perk[]>(initialPerks ?? []);
  const [filteredPerks, setFilteredPerks] = useState<Perk[]>([]);
  const [displayedPerks, setDisplayedPerks] = useState<Perk[]>([]);

  // Common state
  const [searchText, setSearchText] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(
    (initialItems?.length ?? 0) === 0,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const ITEMS_PER_PAGE = 12;

  // Extract categories from data items
  const extractCategories = useCallback(
    <T extends { category?: string }>(data: T[]): string[] => {
      const allCategories: string[] = [];

      for (const item of data) {
        if (item.category && !allCategories.includes(item.category)) {
          allCategories.push(item.category);
        }
      }

      return allCategories.sort((a, b) => a.localeCompare(b));
    },
    [],
  );

  // Update state with fetched items data
  const processItemsData = useCallback(
    (fetchedItems: Item[]) => {
      const allCategories = extractCategories(fetchedItems);

      setItems(fetchedItems);
      setCategories(allCategories);
      setFilteredItems(fetchedItems);
      setDisplayedItems(fetchedItems.slice(0, ITEMS_PER_PAGE));
      setHasMore(fetchedItems.length > ITEMS_PER_PAGE);
    },
    [extractCategories],
  );

  // Update state with fetched creatures data
  const processCreaturesData = useCallback(
    (fetchedCreatures: Creature[]) => {
      const allCategories = extractCategories(fetchedCreatures);

      setCreatures(fetchedCreatures);
      setCategories(allCategories);
      setFilteredCreatures(fetchedCreatures);
      setDisplayedCreatures(fetchedCreatures.slice(0, ITEMS_PER_PAGE));
      setHasMore(fetchedCreatures.length > ITEMS_PER_PAGE);
    },
    [extractCategories],
  );

  // Update state with fetched perks data
  const processPerksData = useCallback((fetchedPerks: Perk[]) => {
    // Perks don't have categories in the JSON, so we set empty categories
    setPerks(fetchedPerks);
    setCategories([]);
    setFilteredPerks(fetchedPerks);
    setDisplayedPerks(fetchedPerks.slice(0, ITEMS_PER_PAGE));
    setHasMore(fetchedPerks.length > ITEMS_PER_PAGE);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (contentType === "items") {
          if (items.length > 0) {
            processItemsData(items);
            setIsLoading(false);
            return;
          }
          setIsLoading(true);
          const fetchedItems = await getItems();
          if (fetchedItems != null) {
            processItemsData(fetchedItems);
          }
        } else if (contentType === "creatures") {
          if (creatures.length > 0) {
            processCreaturesData(creatures);
            setIsLoading(false);
            return;
          }
          setIsLoading(true);
          const fetchedCreatures = await getCreatures();
          if (fetchedCreatures != null) {
            processCreaturesData(fetchedCreatures);
          }
        } else if (contentType === "perks") {
          if (perks.length > 0) {
            processPerksData(perks);
            setIsLoading(false);
            return;
          }
          setIsLoading(true);
          const fetchedPerks = await getPerks();
          if (fetchedPerks != null) {
            processPerksData(fetchedPerks);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchWikiUpdate = async () => {
      if (wikiLastUpdate) {
        return;
      }
      const lastUpdate = await getWikiLastUpdate();
      setWikiLastUpdate(lastUpdate);
    };

    loadData();
    fetchWikiUpdate();
  }, [
    contentType,
    creatures,
    items,
    perks,
    processItemsData,
    processCreaturesData,
    processPerksData,
    wikiLastUpdate,
  ]);

  const searchContent = useCallback(
    (search: string, category: string) => {
      sendEvent(AnalyticsEvent.SEARCH, { props: { term: search } });

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
      } else if (contentType === "creatures") {
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
      } else if (contentType === "perks") {
        let filtered = perks;

        // Perks don't have categories, so we skip category filtering

        if (search.trim()) {
          const searchTerms = search.toLowerCase().split(" ").filter(Boolean);

          filtered = filtered.filter((perk) => {
            const perkName = perk.name.toLowerCase();
            const perkDescription = perk.description.toLowerCase();
            return searchTerms.every(
              (term) =>
                perkName.includes(term) || perkDescription.includes(term),
            );
          });
        }

        setFilteredPerks(filtered);
        setCurrentPage(1);
        setDisplayedPerks(filtered.slice(0, ITEMS_PER_PAGE));
        setHasMore(filtered.length > ITEMS_PER_PAGE);
      }
    },
    [items, creatures, perks, t, contentType],
  );

  useEffect(() => {
    const search = searchParams?.toString() ?? "";
    if (search) {
      const parsed = queryString.parse(`?${search}`);

      if (
        parsed?.type &&
        (parsed.type === "items" ||
          parsed.type === "creatures" ||
          parsed.type === "perks")
      ) {
        setContentType(parsed.type);
      }

      // Read the category parameter from URL
      if (parsed?.category && typeof parsed.category === "string") {
        setCategoryFilter(parsed.category);
      } else {
        setCategoryFilter("All");
      }

      if (parsed?.s) {
        setSearchText(String(parsed.s));
        // Use the category from URL if available, or "All" if not
        const categoryToUse = parsed?.category
          ? String(parsed.category)
          : "All";
        searchContent(String(parsed.s), categoryToUse);
      } else {
        setSearchText("");
      }
    }
  }, [searchParams, searchContent]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    if (contentType === "items") {
      const nextItems = filteredItems.slice(0, nextPage * ITEMS_PER_PAGE);
      setDisplayedItems(nextItems);
      setHasMore(nextItems.length < filteredItems.length);
    } else if (contentType === "creatures") {
      const nextCreatures = filteredCreatures.slice(
        0,
        nextPage * ITEMS_PER_PAGE,
      );
      setDisplayedCreatures(nextCreatures);
      setHasMore(nextCreatures.length < filteredCreatures.length);
    } else if (contentType === "perks") {
      const nextPerks = filteredPerks.slice(0, nextPage * ITEMS_PER_PAGE);
      setDisplayedPerks(nextPerks);
      setHasMore(nextPerks.length < filteredPerks.length);
    }
  }, [
    filteredItems,
    filteredCreatures,
    filteredPerks,
    currentPage,
    contentType,
  ]);

  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.currentTarget.value);
    },
    [],
  );

  // Helper function to build URL parameters
  const buildSearchParams = useCallback(
    (
      search: string,
      category: string,
      type: "items" | "creatures" | "perks",
    ) => {
      const searchParams = new URLSearchParams();

      // Add search parameter if it exists
      if (search.trim()) {
        searchParams.set("s", search);
      }

      // Always add content type
      searchParams.set("type", type);

      // Add category only if it's not "All" and type is not "perks" (perks don't have categories)
      if (category !== "All" && type !== "perks") {
        searchParams.set("category", category);
      }

      return searchParams;
    },
    [],
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCategory = e.target.value;
      setCategoryFilter(newCategory);
      searchContent(searchText, newCategory);

      const searchParams = buildSearchParams(
        searchText,
        newCategory,
        contentType,
      );
      router.push(getLanguagePrefixedPath(`/wiki?${searchParams.toString()}`));
    },
    [
      searchText,
      searchContent,
      router,
      getLanguagePrefixedPath,
      contentType,
      buildSearchParams,
    ],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        searchContent(searchText, categoryFilter);

        const searchParams = buildSearchParams(
          searchText,
          categoryFilter,
          contentType,
        );
        router.push(getLanguagePrefixedPath(`/wiki?${searchParams.toString()}`));
      }
    },
    [
      searchContent,
      searchText,
      categoryFilter,
      router,
      getLanguagePrefixedPath,
      contentType,
      buildSearchParams,
    ],
  );

  const handleSearchClick = useCallback(() => {
    searchContent(searchText, categoryFilter);

    const searchParams = buildSearchParams(
      searchText,
      categoryFilter,
      contentType,
    );
    router.push(getLanguagePrefixedPath(`/wiki?${searchParams.toString()}`));
  }, [
    searchContent,
    searchText,
    categoryFilter,
    router,
    getLanguagePrefixedPath,
    contentType,
    buildSearchParams,
  ]);

  const handleContentTypeChange = useCallback(
    (type: "items" | "creatures" | "perks") => {
      setContentType(type);
      setSearchText("");
      setCategoryFilter("All");
      setCurrentPage(1);

      const searchParams = buildSearchParams("", "All", type);
      router.push(getLanguagePrefixedPath(`/wiki?${searchParams.toString()}`));
    },
    [router, getLanguagePrefixedPath, buildSearchParams],
  );

  const wikiStructuredData = useMemo(() => {
    const listElements: Array<Record<string, unknown>> = [];
    const maxEntities = 12;

    if (contentType === "items") {
      for (const currentItem of displayedItems.slice(0, maxEntities)) {
        listElements.push({
          "@type": "ListItem",
          item: {
            "@type": "DefinedTerm",
            name: currentItem.name,
            url: `${domain}${getItemUrl(currentItem.name)}`,
          },
        });
      }
    } else if (contentType === "creatures") {
      for (const currentCreature of displayedCreatures.slice(0, maxEntities)) {
        listElements.push({
          "@type": "ListItem",
          item: {
            "@type": "Thing",
            name: currentCreature.name,
            url: `${domain}${getCreatureUrl(currentCreature.name)}`,
          },
        });
      }
    } else {
      for (const currentPerk of displayedPerks.slice(0, maxEntities)) {
        listElements.push({
          "@type": "ListItem",
          item: {
            "@type": "DefinedTerm",
            name: currentPerk.name,
          },
        });
      }
    }

    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t("seo.wiki.title"),
      description: wikiDescription,
      url: wikiCanonical,
      inLanguage: i18n.language,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${domain}/#website`,
        url: domain,
      },
      mainEntity: {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: listElements.length,
        itemListElement: listElements,
      },
      about: [
        {
          "@type": "Thing",
          name: "Items",
        },
        {
          "@type": "Thing",
          name: "Creatures",
        },
        {
          "@type": "Thing",
          name: "Perks",
        },
      ],
    };
  }, [
    contentType,
    displayedCreatures,
    displayedItems,
    displayedPerks,
    domain,
    i18n.language,
    t,
    wikiCanonical,
    wikiDescription,
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderMeta
        title={t("seo.wiki.title")}
        description={wikiDescription}
        canonical={wikiCanonical}
        image="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/wiki.jpg"
        keywords="Last Oasis, wiki, items, creatures, resources, crafting, game, guide, guide"
        structuredData={wikiStructuredData}
      />
      <div className="w-full mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="p-3 md:p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              {t("menu.wiki")}
            </h1>

            {wikiLastUpdate && (
              <p className="text-sm text-gray-400 mb-4">
                {t("wiki.lastUpdate")}:{" "}
                {new Date(wikiLastUpdate).toLocaleDateString()}
              </p>
            )}

            {/* Content Type Selector */}
            <ContentTypeSelector
              selectedType={contentType}
              onTypeChange={handleContentTypeChange}
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
          displayedPerks={displayedPerks}
        />

        {/* Pagination */}
        <Pagination
          contentType={contentType}
          isLoading={isLoading}
          hasMore={hasMore}
          displayedItems={displayedItems}
          displayedCreatures={displayedCreatures}
          displayedPerks={displayedPerks}
          filteredItems={filteredItems}
          filteredCreatures={filteredCreatures}
          filteredPerks={filteredPerks}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default Wiki;
