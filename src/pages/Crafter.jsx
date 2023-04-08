import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import Axios from "axios";
import { getItems } from "../services";
import ModalMessage from "../components/ModalMessage";
import Items from "../components/Crafter/Items";
import SelectedItem from "../components/Crafter/SelectedItem";
import TotalMaterials from "../components/Crafter/TotalMaterials";

class Crafter extends Component {
  state = {
    items: [],
    selectedItems: [],
    searchText: "",
    filteredItems: [],
    totalIngredients: [],
    error: "",
  };

  componentDidMount() {
    this.updateRecipes();
  }

  async updateRecipes() {
    let items = await getItems();
    if (items != null) {
      items = items.filter((it) => it.crafting != null);
      this.setState({ items: items });
      this.getRecipes();
    }
  }

  getRecipes = () => {
    const parsed = queryString.parse(this.props.location.search);
    const recipe = parsed.recipe;
    if (recipe != null && recipe.length > 0) {
      Axios.get(process.env.REACT_APP_API_URL + "/recipes/" + recipe)
        .then((response) => {
          if (response.status === 200) {
            if (response.data.items != null) {
              const allItems = response.data.items;
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
    } else {
      let itemName = parsed.craft;

      if (itemName != null && itemName.length > 0) {
        itemName = decodeURI(itemName);
        itemName = itemName.toLowerCase();
        this.setState({ searchText: itemName });
        this.updateSearch(itemName);
      }
    }
  };

  handleInputChangeSearchItem = (event) => {
    if (event != null) {
      const searchText = event.currentTarget.value;
      this.setState({ searchText });
      this.updateSearch(searchText);
    }
  };

  updateSearch = (searchText) => {
    const { t } = this.props;
    const filteredItems = this.state.items.filter((it) => {
      return searchText.split(" ").every((internalItem) => {
        return (
          t(it.name).toLowerCase().indexOf(internalItem.toLowerCase()) !== -1
        );
      });
    });
    this.setState({ filteredItems });
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
    let selectedItem = this.state.items.find((it) => it.name === itemName);
    if (this.state.selectedItems.some((it) => it.name === itemName)) {
      selectedItem = this.state.selectedItems.find(
        (it) => it.name === itemName
      );
      this.changeCount(itemName, parseInt(selectedItem.count) + count);
    } else if (selectedItem != null) {
      const selectedItems = this.state.selectedItems.concat([
        {
          name: selectedItem.name,
          category: selectedItem.category ? selectedItem.category : "",
          crafting: this.getIngredients(selectedItem.name),
          damage: selectedItem.damage,
          count: count,
        },
      ]);
      this.setState({ selectedItems });
    }
  };

  changeCount = (itemName, count) => {
    if (count <= 0) {
      this.removeSelectedItem(itemName);
    } else {
      const allitems = this.state.selectedItems.map((item) => {
        if (item.name === itemName) {
          item.count = count;
        }
        return item;
      });

      this.setState({ allitems });
    }
  };

  getIngredients = (itemName, secondTree = false) => {
    const all = [];
    const selectedItem = this.state.items.filter((it) => it.name === itemName);
    if (selectedItem[0] != null && selectedItem[0].crafting != null) {
      selectedItem[0].crafting.forEach((recipe) => {
        const recipeObject = {};
        if (recipe.ingredients != null) {
          const ingredients = [];
          recipe.ingredients.forEach((ingredient) => {
            if (!secondTree) {
              const subIngredients = this.getIngredients(ingredient.name, true);
              if (subIngredients.length > 0) {
                ingredient["ingredients"] = subIngredients;
              }
            }
            ingredients.push(ingredient);
          });
          recipeObject.ingredients = ingredients;
        }
        if (recipe.output != null) {
          recipeObject.output = recipe.output;
        }
        if (recipe.station != null) {
          recipeObject.station = recipe.station;
        }
        if (recipe.time != null) {
          recipeObject.time = recipe.time;
        }
        all.push(recipeObject);
      });
    }
    return all;
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

  removeSelectedItem = (itemName) => {
    const selectedItems = this.state.selectedItems.filter(
      (it) => it.name !== itemName
    );
    this.setState({ selectedItems });
  };

  render() {
    if (this.state.error) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: this.state.error,
            redirectPage: "/",
          }}
        />
      );
    }

    return (
      <div className="row flex-xl-nowrap">
        <Helmet>
          <title>
            Last Oasis Crafting Calculator - Stiletto for Last Oasis
          </title>
          <meta
            name="description"
            content="See the materials needed to build each thing"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Crafter - Stiletto for Last Oasis"
          />
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
        <div className="col mb-2">
          <form role="search" className="bd-search d-flex align-items-center">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              data-cy="crafter-search"
              onChange={this.handleInputChangeSearchItem}
              value={this.state.searchText}
            />
            <button
              className="btn btn-outline-primary d-md-none ml-3"
              type="button"
              data-toggle="collapse"
              data-target="#items-nav"
              aria-controls="items-nav"
              aria-expanded="false"
              aria-label="Toggle items"
            >
              <i className="fas fa-list fa-lg"></i>
            </button>
          </form>
          <nav
            className="collapse show mt-2"
            id="items-nav"
            aria-label="Items Navs"
          >
            <ul
              className="nav overflow-auto list-group"
              style={{ height: "95vh" }}
            >
              {this.showAllItems()}
            </ul>
          </nav>
        </div>
        <main role="main" className="col-md-9 col-lg-8 col-xl-8">
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

export default withTranslation()(Crafter);
