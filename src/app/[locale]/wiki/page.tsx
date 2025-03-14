"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import type { Item } from "@/types/items";
import Ingredient from "@/components/Ingredient";
import { getItems } from "@/lib/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wiki - Stiletto for Last Oasis",
  description: "Last oasis Wiki",
  openGraph: {
    title: "Wiki - Stiletto for Last Oasis",
    description: "Last oasis Wiki",
  },
};

export default function WikiPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("All");

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

        allCategories.sort();

        setItems(fetchedItems);
        setCategories(allCategories);
      }
    };

    updateRecipes();

    const searchQuery = searchParams.get("s");
    if (searchQuery) {
      setSearchText(searchQuery);
      searchItems(searchQuery, "All");
    }
  }, [searchParams]);

  const searchItems = (search = searchText, category = categoryFilter) => {
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
        <div className="col-12 col-xl-3 col-lg-6" key={`wiki-${item.name}`}>
          <Ingredient ingredient={item} value={1} />
        </div>
      ));
    }

    return (
      <div className="col-12" key="wiki-notfound">
        <div className="card">
          <div className="card-header text-center">{t("Nothing found")}</div>
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

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.currentTarget.value);

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
    <div className="row">
      <div className="col-12 mb-2">
        <div className="card">
          <div className="card-header text-center">
            <div className="col-xs-12 col-xl-6 mx-auto">
              <div
                className="input-group"
                itemProp="potentialAction"
                data-cy="wiki-search"
              >
                <input
                  type="search"
                  className="form-control"
                  placeholder={t("Search")}
                  aria-label={t("Search")}
                  onChange={handleSearchTextChange}
                  onKeyDown={handleKeyPress}
                  value={searchText}
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={() => searchItems()}
                  >
                    {t("Search")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="col-xl-4 col-6">
              <div className="input-group">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="category-filter">
                    {t("Filter by category")}
                  </label>
                </div>
                <select
                  id="category-filter"
                  className="custom-select"
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
      <div className="col-12">
        <div className="row mb-2 content-v-a">{showItems()}</div>
      </div>
    </div>
  );
}
