import React, { Component } from "react";
import Items from "./Items";
import SelectedItem from "./SelectedItem";
import Ingredient from "./Ingredient";

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
  };

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/dm94/lastoasisbot/master/itemsES_min.json"
    )
      .then((response) => response.json())
      .then((items) => this.setState({ items }));
  }

  handleInputChangeSearchItem = (event) => {
    if (event != null) {
      const searchText = event.currentTarget.value;
      const filteredItems = this.state.items.filter((it) =>
        it.name.toLowerCase().match(searchText)
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

  showTotal() {
    let totalIngredients = [];
    this.state.selectedItems.forEach((item) => {
      if (item.crafting != null) {
        if (item.crafting[0].ingredients != null) {
          item.crafting[0].ingredients.forEach((ingredient) => {
            if (
              totalIngredients.find((ingre) => ingre.name === ingredient.name)
            ) {
              totalIngredients.map((ingre) => {
                if (ingre.name === ingredient.name) {
                  ingre.count += ingredient.count * item.count;
                }
              });
            } else {
              totalIngredients.push({
                name: ingredient.name,
                count: ingredient.count * item.count,
              });
            }
          });
        }
      }
    });
    return totalIngredients.map((ingredient) => (
      <Ingredient key={ingredient.name} ingredient={ingredient} value={1} />
    ));
  }

  render() {
    return (
      <div className="row">
        <div className="col-3">
          <div className="navbar">
            <ul className="list-group">
              <li className="list-group-item">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={this.handleInputChangeSearchItem}
                />
              </li>
              <ul
                className="list-group overflow-auto"
                style={{ height: "40em" }}
              >
                {this.showAllItems()}
              </ul>
            </ul>
          </div>
        </div>
        <div className="col-8">
          <div className="col-12">{this.showSelectedItems()}</div>
          <div className="col-6">
            <div className="card">
              <div className="card-header">
                <div className="my-0 font-weight-normal">
                  Materiales necesarios en total
                </div>
              </div>
              <div className="card-body">
                <div className="list-unstyled">{this.showTotal()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ItemSelector;
