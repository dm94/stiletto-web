import type React from "react";
import Ingredient from "../Ingredient";
import type { Item } from "../../types/item";

interface ListIngredientsProps {
  selectedItems: Item[];
}

const ListIngredients: React.FC<ListIngredientsProps> = ({ selectedItems }) => {
  if (!selectedItems) {
    return null;
  }

  const totalIngredients: Array<{
    name: string;
    count: number;
    ingredients?: any[];
  }> = [];

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
