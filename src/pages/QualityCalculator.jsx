import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getStyle } from "../components/BGDarkSyles";
import Ingredient from "../components/Ingredient";
import IngredientQualityInputs from "../components/IngredientQualityInputs";
import Axios from "axios";

class QualityCalculator extends Component {
  state = {
    items: [],
    selectedItems: [],
    searchText: "",
    filteredItems: [],
    itemSelected: "",
    ingredients: [],
    qualities: [],
  };

  componentDidMount() {
    Axios.get(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json"
    ).then((response) => {
      const items = response.data.filter(
        (it) => !it.category.includes("upgrades")
      );
      this.setState({ items });
    });
  }

  handleInputChangeSearchItem = (event) => {
    const { t } = this.props;
    if (event != null) {
      const searchText = event.currentTarget.value;
      const filteredItems = this.state.items.filter((it) =>
        t(it.name).toLowerCase().match(searchText.toLowerCase())
      );
      this.setState({ searchText });
      this.setState({ filteredItems: filteredItems });
    }
  };

  showAllItems(t) {
    if (
      this.state.filteredItems.length > 0 ||
      this.state.searchText.length > 0
    ) {
      return this.state.filteredItems.map((i) => (
        <option key={"select" + i.name} value={i.name}>
          {t(i.name)}
        </option>
      ));
    } else {
      return this.state.items.map((i) => (
        <option key={"select-" + i.name} value={i.name}>
          {t(i.name)}
        </option>
      ));
    }
  }

  changeAverage = (type, average) => {
    let otherMats = this.state.qualities.filter((m) => m.mat !== type);
    let mat = { mat: type, average: parseInt(average) };
    otherMats.push(mat);
    this.setState({ qualities: otherMats });
  };

  showIngredients(t) {
    if (this.state.ingredients.length > 0) {
      return this.state.ingredients.map((ingredient) => (
        <div key={"column" + ingredient.name} className="col-6">
          <Ingredient ingredient={ingredient} value={1} />
          <IngredientQualityInputs
            key={"qinputs" + ingredient.name}
            ingredient={ingredient}
            onChangeAverage={this.changeAverage}
          />
        </div>
      ));
    }
  }

  averageQualityTotal(t) {
    let maxQuality = 0;
    this.state.qualities.forEach((mat) => {
      maxQuality = maxQuality + parseInt(mat.average);
    });
    return (
      <p className="text-center m-0 text-primary">
        {t("Final quality")}:
        <span className="ml-1">
          {maxQuality / this.state.ingredients.length > 0
            ? Math.floor(maxQuality / this.state.ingredients.length)
            : 0}
        </span>
      </p>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container">
        <Helmet>
          <title>Quality Calculator - Stiletto</title>
          <meta name="description" content="Quality calculator" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@dm94dani" />
          <meta name="twitter:title" content="Crafter - Stiletto" />
          <meta name="twitter:description" content="Quality calculator" />
        </Helmet>
        <div className="row">
          <div className="col-xl-3">
            <div className="col-12">
              <input
                className={getStyle("form-control mb-1")}
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={this.handleInputChangeSearchItem}
                value={this.state.searchText}
              />
            </div>
            <div className="col-12">
              <select
                className={getStyle("custom-select")}
                value={this.state.itemSelected.name}
                onChange={(evt) => {
                  const itemFiltered = this.state.items.filter(
                    (it) => it.name === evt.target.value
                  );
                  if (itemFiltered[0] != null) {
                    if (
                      itemFiltered[0].crafting != null &&
                      itemFiltered[0].crafting[0] != null
                    ) {
                      this.setState({
                        itemSelected: itemFiltered[0],
                        ingredients: itemFiltered[0].crafting[0].ingredients,
                        qualities: [],
                      });
                    }
                  }
                }}
              >
                {this.showAllItems(t)}
              </select>
            </div>
          </div>
          <div className="col-xl-9">
            <div className="row">
              <div className="col-12">
                <div className={getStyle("card border-info")}>
                  <div className="text-center card-header">
                    <button
                      className={getStyle("close")}
                      onClick={() =>
                        this.setState({
                          itemSelected: "",
                          ingredients: [],
                          qualities: [],
                        })
                      }
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    {this.state.itemSelected !== "" &&
                      t(this.state.itemSelected.name)}
                  </div>
                  <div className="card-body">
                    <div className="row">{this.showIngredients(t)}</div>
                  </div>
                  <div className="card-footer">
                    {this.averageQualityTotal(t)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(QualityCalculator);
