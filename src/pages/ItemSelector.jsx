import React, { Component } from "react";
import Items from "../components/Items";
import SelectedItem from "../components/SelectedItem";
import TotalMaterials from "../components/TotalMaterials";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import ModalMessage from "../components/ModalMessage";
const queryString = require("query-string");

class ItemSelector extends Component {
  state = {
    items: [],
    selectedItems: [],
    searchText: "",
    filteredItems: [],
    totalIngredients: [],
    error: "",
  };

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json"
    )
      .then((response) => response.json())
      .then((items) => {
        this.setState({ items: items });
        this.getRecipes();
      });
  }

  getRecipes() {
    const parsed = queryString.parse(this.props.location.search);
    let recipe = parsed.recipe;
    if (recipe != null && recipe.length > 0) {
      Axios.get(process.env.REACT_APP_API_URL + "/recipes/" + recipe)
        .then((response) => {
          if (response.status === 200) {
            if (response.data.items != null) {
              let allItems = JSON.parse(response.data.items);
              console.log(allItems);
              allItems.forEach((it) => {
                this.handleAdd(it.name, parseInt(it.count));
              });
            }
          } else if (response.status === 503) {
            this.setState({ error: "Error connecting to database" });
          }
        })
        .catch(() => {
          this.setState({ error: "Error when connecting to the API" });
        });
    }
  }

  handleInputChangeSearchItem = (event) => {
    const { t } = this.props;
    if (event != null) {
      const searchText = event.currentTarget.value;
      const filteredItems = this.state.items.filter((it) =>
        t(it.name).toLowerCase().match(searchText.toLowerCase())
      );
      this.setState({ searchText });
      this.setState({ filteredItems });
    }
  };

  showAllItems() {
    if (
      this.state.filteredItems.length > 0 ||
      this.state.searchText.length > 0
    ) {
      return (
        <Items
          key="itemListFiltered"
          items={this.state.filteredItems}
          onAdd={this.handleAdd}
        />
      );
    } else {
      return (
        <Items key="itemList" items={this.state.items} onAdd={this.handleAdd} />
      );
    }
  }

  handleAdd = (itemName, count) => {
    if (count == null) {
      count = 1;
    }
    let selectedItem = this.state.items.filter((it) => it.name === itemName);
    if (
      this.state.selectedItems.filter((it) => it.name === itemName).length > 0
    ) {
      let selectedItem = this.state.selectedItems.filter(
        (it) => it.name === itemName
      );
      this.changeCount(itemName, parseInt(selectedItem[0].count) + count);
    } else {
      if (selectedItem[0] != null) {
        const selectedItems = this.state.selectedItems.concat([
          {
            name: selectedItem[0].name,
            category: selectedItem[0].category,
            crafting: selectedItem[0].crafting,
            damage: selectedItem[0].damage,
            count: count,
          },
        ]);
        this.setState({ selectedItems });
      }
    }
  };

  changeCount = (itemName, count) => {
    let selectedItem = this.state.selectedItems.filter(
      (it) => it.name === itemName
    );
    let otherItems = this.state.selectedItems.filter(
      (it) => it.name !== itemName
    );
    if (selectedItem[0] != null) {
      if (count <= 0) {
        this.removeSelectedItem(itemName);
      } else {
        const selectedItems = otherItems.concat([
          {
            name: selectedItem[0].name,
            category: selectedItem[0].category,
            crafting: selectedItem[0].crafting,
            damage: selectedItem[0].damage,
            count: count,
          },
        ]);
        this.setState({ selectedItems });
      }
    }
  };

  showSelectedItems() {
    if (this.state.selectedItems != null) {
      return this.state.selectedItems.map((item) => (
        <SelectedItem
          key={item.name}
          item={item}
          value={item.count}
          onChangeCount={this.changeCount}
        />
      ));
    }
  }

  removeSelectedItem(itemName) {
    const selectedItems = this.state.selectedItems.filter(
      (it) => it.name !== itemName
    );
    this.setState({ selectedItems });
  }

  render() {
    const { t } = this.props;

    if (this.state.error) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: t(this.state.error),
            redirectPage: "/",
          }}
        />
      );
    }

    return (
      <div className="row flex-xl-nowrap">
        <Helmet>
          <title>{t("Crafter")} - Stiletto</title>
          <meta
            name="description"
            content="See the materials needed to build each thing"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Crafter - Stiletto" />
          <meta
            name="twitter:description"
            content="See the materials needed to build each thing"
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
          />
          <link
            rel="canonical"
            href={
              window.location.protocol
                .concat("//")
                .concat(window.location.hostname) +
              (window.location.port ? ":" + window.location.port : "") +
              "/crafter"
            }
          />
        </Helmet>
        <div className="col-md-2 col-xl-3">
          <form role="search" className="bd-search d-flex align-items-center">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={this.handleInputChangeSearchItem}
              value={this.state.searchText}
            />
            <button
              className="btn d-md-none p-0 ml-3"
              type="button"
              data-toggle="collapse"
              data-target="#items-nav"
              aria-controls="items-nav"
              aria-expanded="false"
              aria-label="Toggle items"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                role="img"
                focusable="false"
              >
                <title>{t("Menu")}</title>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M4 7h22M4 15h22M4 23h22"
                ></path>
              </svg>
            </button>
          </form>
          <nav className="collapse show" id="items-nav" aria-label="Items Navs">
            <ul
              className="nav overflow-auto list-group"
              style={{ height: "100vh" }}
            >
              {this.showAllItems()}
            </ul>
          </nav>
        </div>
        <main role="main" className="col-md-9 col-xl-8">
          <div className="col-12 card-group">{this.showSelectedItems()}</div>
          <div className="col-12">
            <TotalMaterials
              key="totalmaterialsid"
              selectedItems={this.state.selectedItems}
              onError={(e) => this.setState({ error: e })}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default withTranslation()(ItemSelector);
