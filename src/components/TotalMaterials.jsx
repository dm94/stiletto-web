import React, { Component } from "react";
import Ingredient from "../components/Ingredient";
import { withTranslation } from "react-i18next";

class ListIngredients extends Component {
  render() {
    let totalIngredients = [];
    this.props.selectedItems.forEach((item) => {
      if (item.crafting != null) {
        if (item.crafting[0].ingredients != null) {
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
      }
    });
    return totalIngredients.map((ingredient) => (
      <Ingredient key={ingredient.name} ingredient={ingredient} value={1} />
    ));
  }
}
class TotalMaterials extends Component {
  constructor(props) {
    super(props);
    this.componentRef = React.createRef();
  }

  render() {
    const { t } = this.props;
    return (
      <div className="card border-warning mb-3">
        <div className="card-header border-warning">
          <div className="font-weight-normal">{t("Total materials")}</div>
        </div>
        <div className="card-body bg-light" id="list-all-items">
          <div className="list-unstyled">
            <ListIngredients
              ref={this.componentRef}
              selectedItems={this.props.selectedItems}
            />
            <li className="text-right text-muted">
              {t("List of all necessary materials by")}{" "}
              stiletto.comunidadgzone.es
            </li>
          </div>
        </div>
      </div>
    );
  }
}
export default withTranslation()(TotalMaterials);
