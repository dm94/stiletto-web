import React, { Component } from "react";
import Ingredient from "../Ingredient";

class ListIngredients extends Component {
  render() {
    const totalIngredients = [];
    this.props?.selectedItems.forEach((item) => {
      if (
        item?.crafting?.[0]?.ingredients != null
      ) {
        const output =
          item.crafting[0].output != null ? item.crafting[0].output : 1;
        item.crafting[0].ingredients.forEach((ingredient) => {
          if (
            totalIngredients.find((ingre) => ingre.name === ingredient.name)
          ) {
            totalIngredients.forEach((ingre) => {
              if (ingre.name === ingredient.name) {
                ingre.count += (ingredient.count / output) * item.count;
              }
            });
          } else {
            totalIngredients.push({
              name: ingredient.name,
              count: (ingredient.count / output) * item.count,
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
