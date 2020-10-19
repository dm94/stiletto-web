import React, { Component } from "react";
import Ingredient from "./Ingredient";

class Ingredients extends Component {
  render() {
    return (
      <div className="col-sm">
        {this.props.crafting.ingredients.name}
        {this.props.crafting.ingredients.map((ingredient) => (
          <Ingredient
            key={ingredient.name}
            ingredient={ingredient}
            value={this.props.value}
          />
        ))}
      </div>
    );
  }
}

export default Ingredients;
