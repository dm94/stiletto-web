import React from "react";
import Ingredient from "./Ingredient";

const Ingredients = ({ crafting, value }) => {
  if (!crafting?.ingredients) {
    return false;
  }

  return crafting.ingredients.map((ingredient) => (
    <Ingredient key={ingredient.name} ingredient={ingredient} value={value} />
  ));
};

export default Ingredients;
