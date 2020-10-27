import React, { Component } from "react";
import Items from "../components/Items";
import SelectedItem from "../components/SelectedItem";
import TotalMaterials from "../components/TotalMaterials";

class ItemSelector extends Component {
  state = {
    items: [
      {
        name: "Base de barrera",
        category: "buildings/construction/barrier",
        crafting: [
          {
            ingredients: [
              {
                name: "Madera",
                count: 50,
              },
              {
                name: "Piedra",
                count: 20,
              },
              {
                name: "Vid Rupu",
                count: 3,
              },
            ],
          },
        ],
      },
    ],
    selectedItems: [],
    searchText: "",
    filteredItems: [],
    totalIngredients: [],
    languaje: "ES",
  };

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/itemsES_min.json"
    )
      .then((response) => response.json())
      .then((items) => this.setState({ items }));
  }

  handleInputChangeSearchItem = (event) => {
    if (event != null) {
      const searchText = event.currentTarget.value;
      const filteredItems = this.state.items.filter((it) =>
        it.name.toLowerCase().match(searchText.toLowerCase())
      );
      this.setState({ searchText });
      this.setState({ filteredItems });
    }
  };

  switchLanguaje = (event) => {
    if (event != null) {
      event.preventDefault();
      var itemsUrlJson;
      if (this.state.languaje === "ES") {
        itemsUrlJson =
          "https://raw.githubusercontent.com/Last-Oasis-Crafter/lastoasis-crafting-calculator/master/src/items.json";
        this.setState({ languaje: "EN" });
      } else {
        itemsUrlJson =
          "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/itemsES_min.json";
        this.setState({ languaje: "ES" });
      }
      fetch(itemsUrlJson)
        .then((response) => response.json())
        .then((items) => this.setState({ items }));
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
    return (
      <div className="row flex-xl-nowrap">
        <div className="col-md-2 col-xl-3">
          <form role="search" className="bd-search d-flex align-items-center">
            <button className="btn btn-warning" onClick={this.switchLanguaje}>
              ES/EN
            </button>
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={this.handleInputChangeSearchItem}
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
                <title>Menu</title>
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

export default ItemSelector;
