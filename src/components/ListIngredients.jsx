import React, { Component } from "react";
import Ingredient from "./Ingredient";

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
              ingredients: ingredient.ingredients,
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

export default ListIngredients;
