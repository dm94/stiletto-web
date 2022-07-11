import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getItems } from "../services";
import Ingredient from "../components/Ingredient";

class Wiki extends Component {
  state = {
    items: [],
    searchText: "",
    filteredItems: [],
    error: "",
  };

  updateRecipes = async () => {
    let items = await getItems();
    if (items != null) {
      this.setState({ items: items });
    }
  };

  handleInputChangeSearchItem = (event) => {
    if (event != null) {
      const searchText = event.currentTarget.value;
      this.setState({ searchText });
    }
  };

  searchItems = async () => {
    if (this.state.items == null || this.state.items.length <= 0) {
      await this.updateRecipes();
    }
    const { t } = this.props;
    const filteredItems = this.state.items.filter((it) => {
      return this.state.searchText.split(" ").every((internalItem) => {
        return (
          t(it.name).toLowerCase().indexOf(internalItem.toLowerCase()) !== -1
        );
      });
    });
    this.setState({ filteredItems });
  };

  showItems = () => {
    if (this.state.filteredItems != null) {
      return this.state.filteredItems.map((item) => (
        <div className="col-12 col-xl-3 col-lg-6" key={"wiki-" + item.name}>
          <Ingredient ingredient={item} value={1} />
        </div>
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
                <div className="input-group mb-3">
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
          </div>
        </div>
        <div className="col-12">
          <div className="row mb-2">{this.showItems()}</div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Wiki);
