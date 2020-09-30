import React, { Component } from "react";
import Items from "./Items";
import Item from "./Item";

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
  };

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/dm94/lastoasisbot/master/itemsES_min.json"
    )
      .then((response) => response.json())
      .then((items) => this.setState({ items }));
  }

  showSelectedItems() {
    if (this.state.selectedItems != null) {
      return this.state.selectedItems.map((item) => (
        <Item key={item.name} item={item} />
      ));
    }
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

  handleAdd = (itemName) => {
    const selectedItem = this.state.items.filter((it) => it.name === itemName);
    const selectedItems = this.state.selectedItems.concat(selectedItem);
    this.setState({ selectedItems });
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

  render() {
    return (
      <div className="row">
        <div className="col-4">
          <div className="navbar navbar-light bg-light">
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
              {this.showAllItems()}
            </ul>
          </div>
        </div>
        <div className="col-8 border border-primary">
          {this.showSelectedItems()}
        </div>
      </div>
    );
  }
}

export default ItemSelector;
