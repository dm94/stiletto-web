import React from "react";
import Ingredient from "../Ingredient";

const ListIngredients = ({ selectedItems }) => {
  if (!selectedItems) {
    return [];
  }

  const totalIngredients = [];

  for (const item of selectedItems) {
    if (item?.crafting?.[0]?.ingredients) {
      const output = item.crafting[0]?.output ?? 1;

      for (const ingredient of item.crafting[0].ingredients) {
        const existingIngredient = totalIngredients.find(
          (ingre) => ingre.name === ingredient.name,
        );

        if (existingIngredient) {
          existingIngredient.count += (ingredient.count / output) * item.count;
        } else {
          totalIngredients.push({
            name: ingredient.name,
            count: (ingredient.count / output) * item.count,
            ingredients: ingredient.ingredients,
          });
        }
      }
    }
  }

  return totalIngredients.map((ingredient) => (
    <Ingredient key={ingredient.name} ingredient={ingredient} value={1} />
  ));
};

export default ListIngredients;
