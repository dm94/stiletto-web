import type React from "react";
import Ingredient from "./Ingredient";
import type { Ingredient as IngredientType } from "../types";
import type { ItemRecipe } from "../types/item";

interface IngredientsProps {
  crafting: IngredientType | ItemRecipe;
  value: number;
}

const Ingredients: React.FC<IngredientsProps> = ({ crafting, value }) => {
  if (!crafting?.ingredients) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 gap-3">
      {crafting.ingredients.map((ingredient) => (
        <div
          key={ingredient.name}
          className="bg-gray-800 rounded-lg p-3 border-l-2 border-blue-500 hover:border-blue-400 transition-colors duration-200"
        >
          <Ingredient ingredient={ingredient} value={value} />
        </div>
      ))}
    </div>
  );
};

export default Ingredients;
