import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getItems } from "../services";
import { sendEvent } from "../page-tracking";
import Ingredient from "../components/Ingredient";

const queryString = require("query-string");

class Wiki extends Component {
  state = {
    items: [],
    searchText: "",
    textSearched: "",
    filteredItems: [],
    error: "",
    categories: [],
    categoryFilter: "All",
  };

  componentDidMount = () => {
    this.updateRecipes();
    let parsed = null;
    if (this.props.location != null && this.props.location.search != null) {
      parsed = queryString.parse(this.props.location.search);
    }
    if (parsed && parsed.s != null) {
      this.setState({ searchText: parsed.s }, () => this.searchItems());
    }
  };

  updateRecipes = async () => {
    let items = await getItems();
    if (items != null) {
      let allCategories = [];

      items.forEach((item) => {
        if (item.category && !allCategories.includes(item.category)) {
          allCategories.push(item.category);
        }
      });
      allCategories.sort();

      this.setState({ items: items, categories: allCategories });
    }
  };

  handleInputChangeSearchItem = (event) => {
    if (event != null) {
      const searchText = event.currentTarget.value;
      this.setState({ searchText });
    }
  };

  searchItems = async () => {
    sendEvent({
      category: "User",
      action: "Wiki search",
      label: this.state.searchText,
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
      return this.state.searchText.split(" ").every((internalItem) => {
        return (
          t(it.name).toLowerCase().indexOf(internalItem.toLowerCase()) !== -1
        );
      });
    });
    this.setState({
      filteredItems: filteredItems,
      textSearched: this.state.searchText,
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

  render() {
    const { t } = this.props;

    return (
      <div className="row">
        <Helmet>
          <title>Wiki - Stiletto for Last Oasis</title>
          <meta name="description" content="Last oasis Wiki" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Wiki - Stiletto for Last Oasis" />
          <meta name="twitter:description" content="Last oasis Wiki" />
          <link
            rel="canonical"
            href={
              window.location.protocol
                .concat("//")
                .concat(window.location.hostname) +
              (window.location.port ? ":" + window.location.port : "") +
              "/wiki"
            }
          />
        </Helmet>
        <div className="col-12 mb-2">
          <div className="card">
            <div className="card-header text-center">
              <div className="col-xs-12 col-xl-6 mx-auto">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control"
                    placeholder={t("Search")}
                    aria-label={t("Search")}
                    aria-describedby="search-addon"
                    onChange={(e) =>
                      this.setState({ searchText: e.currentTarget.value })
                    }
                    onKeyPress={(e) => {
                      let keyPress = e.key || e.keyCode;
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
                    onChange={(evt) =>
                      this.setState({
                        categoryFilter: evt.target.value,
                      })
                    }
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
