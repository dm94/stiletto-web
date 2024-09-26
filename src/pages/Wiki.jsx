import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import { getItems } from "../services";
import { sendEvent } from "../page-tracking";
import Ingredient from "../components/Ingredient";
import { getDomain } from "../functions/utils";

class Wiki extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      searchText: "",
      textSearched: "",
      filteredItems: [],
      error: "",
      categories: [],
      categoryFilter: "All",
    };
  }

  componentDidMount() {
    this.updateRecipes();
    let parsed = null;
    if (this.props?.location?.search != null) {
      parsed = queryString.parse(this.props?.location.search);
    }
    if (parsed?.s != null) {
      this.setState({ searchText: parsed.s }, () => this.searchItems());
    }
  }

  updateRecipes = async () => {
    const items = await getItems();
    if (items != null) {
      const allCategories = [];

      items.forEach((item) => {
        if (item.category && !allCategories.includes(item.category)) {
          allCategories.push(item.category);
        }
      });
      allCategories.sort();

      this.setState({ items: items, categories: allCategories });
    }
  };

  searchItems = async () => {
    const search = this.state.searchText;

    sendEvent("search", {
      props: {
        term: search,
      },
    });

    if (this.state.items == null || this.state.items.length <= 0) {
      await this.updateRecipes();
    }

    const { t } = this.props;
    let filteredItems = this.state.items;

    if (this.state.categoryFilter && this.state.categoryFilter !== "All") {
      filteredItems = filteredItems.filter((item) => {
        return item.category && item.category === this.state.categoryFilter;
      });
    }

    filteredItems = filteredItems.filter((it) => {
      return search.split(" ").every((internalItem) => {
        return (
          t(it.name).toLowerCase().indexOf(internalItem.toLowerCase()) !== -1
        );
      });
    });

    this.setState({
      filteredItems: filteredItems,
      textSearched: search,
    });
  };

  showItems = (t) => {
    if (this.state.filteredItems != null) {
      if (this.state.filteredItems.length > 0) {
        return this.state.filteredItems.map((item) => (
          <div className="col-12 col-xl-3 col-lg-6" key={"wiki-" + item.name}>
            <Ingredient ingredient={item} value={1} />
          </div>
        ));
      } else if (this.state.textSearched.length > 0) {
        return (
          <div className="col-12 " key="wiki-notfound">
            <div className="card">
              <div className="card-header text-center">
                {t("Nothing found")}
              </div>
            </div>
          </div>
        );
      }
    }
  };

  showCategories = (t) => {
    if (this.state.categories != null && this.state.categories.length > 0) {
      return this.state.categories.map((category) => (
        <option key={"option-" + category} value={category}>
          {t(category)}
        </option>
      ));
    }
  };

  updateCategoryFilter = (evt) => {
    this.setState({
      categoryFilter: evt.target.value,
    }, () => {
      this.searchItems();
    });
  };

  render() {
    const { t } = this.props;

    return (
      <div className="row">
        <Helmet>
          <title>Last Oasis Wiki - Stiletto</title>
          <meta name="description" content="Last oasis Wiki" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Wiki - Stiletto for Last Oasis" />
          <meta name="twitter:description" content="Last oasis Wiki" />
          <link
            rel="canonical"
            href={
              getDomain() +
              "/wiki"
            }
          />
        </Helmet>
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
                    aria-describedby="search-addon"
                    itemProp="query-input"
                    name="search"
                    onChange={(e) =>
                      this.setState({ searchText: e.currentTarget.value })
                    }
                    onKeyPress={(e) => {
                      const keyPress = e.key || e.keyCode;
                      if (keyPress === 13 || keyPress === "Enter") {
                        this.searchItems();
                      }
                    }}
                    value={this.state.searchText}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-info"
                      onClick={this.searchItems}
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
                    <label
                      className="input-group-text"
                      htmlFor="category-filter"
                    >
                      {t("Filter by category")}
                    </label>
                  </div>
                  <select
                    id="category-filter"
                    className="custom-select"
                    value={this.state.categoryFilter}
                    onChange={this.updateCategoryFilter}
                  >
                    <option key="all" value="All">
                      {t("All")}
                    </option>
                    {this.showCategories(t)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="row mb-2">{this.showItems(t)}</div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Wiki);
