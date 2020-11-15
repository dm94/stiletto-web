import React, { Component } from "react";
import Items from "../components/Items";
import SelectedItem from "../components/SelectedItem";
import TotalMaterials from "../components/TotalMaterials";
import { withTranslation } from "react-i18next";
import i18next from "i18next";

class ItemSelector extends Component {
  state = {
    items: [],
    selectedItems: [],
    searchText: "",
    filteredItems: [],
    totalIngredients: [],
    language: localStorage.getItem("i18nextLng"),
  };

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json"
    )
      .then((response) => response.json())
      .then((items) => this.setState({ items }));
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

  switchLanguage = (event) => {
    if (event != null) {
      event.preventDefault();
      this.setState({ searchText: "" });
      if (this.state.language === "es") {
        this.setState({ language: "en" });
        i18next.changeLanguage("en");
      } else {
        this.setState({ language: "es" });
        i18next.changeLanguage("es");
      }
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

  handleAdd = (itemName) => {
    let selectedItem = this.state.items.filter((it) => it.name === itemName);
    if (
      this.state.selectedItems.filter((it) => it.name === itemName).length > 0
    ) {
      this.addQuantity(itemName);
    } else {
      if (selectedItem[0] != null) {
        const selectedItems = this.state.selectedItems.concat([
          {
            name: selectedItem[0].name,
            category: selectedItem[0].category,
            crafting: selectedItem[0].crafting,
            count: 1,
          },
        ]);
        this.setState({ selectedItems });
      }
    }
  };

  addQuantity = (itemName) => {
    this.changeCount(itemName, 1);
  };

  addQuantity10 = (itemName) => {
    this.changeCount(itemName, 10);
  };

  addQuantity100 = (itemName) => {
    this.changeCount(itemName, 100);
  };

  removeQuantity = (itemName) => {
    this.changeCount(itemName, 1 * -1);
  };

  removeQuantity10 = (itemName) => {
    this.changeCount(itemName, 10 * -1);
  };

  removeQuantity100 = (itemName) => {
    this.changeCount(itemName, 100 * -1);
  };

  changeCount(itemName, count) {
    let selectedItem = this.state.selectedItems.filter(
      (it) => it.name === itemName
    );
    let otherItems = this.state.selectedItems.filter(
      (it) => it.name !== itemName
    );
    if (selectedItem[0] != null) {
      if (selectedItem[0].count + count < 0) {
        this.removeSelectedItem(itemName);
      } else {
        const selectedItems = otherItems.concat([
          {
            name: selectedItem[0].name,
            category: selectedItem[0].category,
            crafting: selectedItem[0].crafting,
            count: selectedItem[0].count + count,
          },
        ]);
        this.setState({ selectedItems });
      }
    }
  }

  showSelectedItems() {
    if (this.state.selectedItems != null) {
      return this.state.selectedItems.map((item) => (
        <SelectedItem
          key={item.name}
          item={item}
          value={item.count}
          onAdd={this.addQuantity}
          onRemove={this.removeQuantity}
          onAdd10={this.addQuantity10}
          onRemove10={this.removeQuantity10}
          onAdd100={this.addQuantity100}
          onRemove100={this.removeQuantity100}
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
    return (
      <div className="row flex-xl-nowrap">
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
            <img
              className="img-thumbnail"
              width="15%"
              src={
                this.state.language === "es"
                  ? "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/es.jpg"
                  : "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/en.jpg"
              }
              alt={
                this.state.language === "es"
                  ? "Spanish language"
                  : "English language"
              }
              onClick={this.switchLanguage}
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
            />
          </div>
        </main>
      </div>
    );
  }
}

export default withTranslation()(ItemSelector);
