import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import { getItems } from "../services";
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
    <div className="row">
      <HeaderMeta
        title="Wiki - Stiletto for Last Oasis"
        description="Last oasis Wiki"
        cannonical={`${getDomain()}/wiki`}
      />
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
};

export default Wiki;
