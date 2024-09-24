import React, { Component } from "react";
import Ingredient from "./Ingredient";

class Ingredients extends Component {
  render() {
    return this.props?.crafting.ingredients.map((ingredient) => (
      <Ingredient
        key={ingredient.name}
        ingredient={ingredient}
        value={this.props?.value}
      />
    ));
  }
}

export default Ingredients;
