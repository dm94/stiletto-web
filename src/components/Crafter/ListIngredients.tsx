import type React from "react";
import { memo, useMemo } from "react";
import Ingredient from "../Ingredient";
import type { Item } from "@ctypes/item";

interface ListIngredientsProps {
  selectedItems: Item[];
}

const ListIngredients: React.FC<ListIngredientsProps> = memo(
  ({ selectedItems }) => {
    if (!selectedItems) {
      return null;
    }

    const totalIngredients = useMemo(() => {
      const ingredients: Array<{
        name: string;
        count: number;
        ingredients?: any[];
      }> = [];

      for (const item of selectedItems) {
        if (item?.crafting?.[0]?.ingredients) {
          const output = item.crafting[0]?.output ?? 1;

          for (const ingredient of item.crafting[0].ingredients) {
            const existingIngredient = ingredients.find(
              (ingre) => ingre.name === ingredient.name,
            );

            if (existingIngredient) {
              existingIngredient.count +=
                (ingredient.count / output) * item.count;
            } else {
              ingredients.push({
                name: ingredient.name,
                count: (ingredient.count / output) * item.count,
                ingredients: ingredient.ingredients,
              });
            }
          }
        }
      }

      return ingredients;
    }, [selectedItems]);

    return totalIngredients.map((ingredient) => (
      <Ingredient key={ingredient.name} ingredient={ingredient} value={1} />
    ));
  },
);

export default ListIngredients;
