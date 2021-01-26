import React, { Component } from "react";
import Ingredient from "../components/Ingredient";
import { withTranslation } from "react-i18next";
import { getStyle } from "../BGDarkSyles";

class ListIngredients extends Component {
  render() {
    let totalIngredients = [];
    this.props.selectedItems.forEach((item) => {
      if (item.crafting != null && item.crafting[0].ingredients != null) {
        item.crafting[0].ingredients.forEach((ingredient) => {
          if (
            totalIngredients.find((ingre) => ingre.name === ingredient.name)
          ) {
            totalIngredients.forEach((ingre) => {
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
    });
    return totalIngredients.map((ingredient) => (
      <Ingredient key={ingredient.name} ingredient={ingredient} value={1} />
    ));
  }
}
class TotalMaterials extends Component {
  itemsList() {
    return this.props.selectedItems.map((item) => (
      <li className="list-inline-item" key={item.name}>
        {item.count}x {item.name} -
      </li>
    ));
  }

  render() {
    const { t } = this.props;
    return (
      <div className={getStyle("card border-warning m-3")}>
        <div className="card-header border-warning">
          <div className="font-weight-normal">{t("Total materials")}</div>
        </div>
        <div className="card-body" id="list-all-items">
          <ul className="list-inline">{this.itemsList()}</ul>
          <div className="list-unstyled">
            <ListIngredients
              ref={this.componentRef}
              selectedItems={this.props.selectedItems}
            />
            <li className="text-right text-muted">
              {t("List of all necessary materials by")}{" "}
              {window.location.hostname +
                (window.location.port ? ":" + window.location.port : "")}
            </li>
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(TotalMaterials);
