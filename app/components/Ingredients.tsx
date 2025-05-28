import type React from "react";
import { memo } from "react";
import Ingredient from "./Ingredient";
import { useTranslation } from "react-i18next";
import type { Ingredient as IngredientType } from "@ctypes";
import type { ItemRecipe } from "@ctypes/item";

interface IngredientsProps {
  crafting: IngredientType | ItemRecipe;
  value: number;
}

const Ingredients: React.FC<IngredientsProps> = memo(({ crafting, value }) => {
  const { t } = useTranslation();

  if (!crafting?.ingredients) {
    return null;
  }

  const outputAmount =
    crafting.output && crafting.output > 1 ? crafting.output : null;

  return (
    <div className="w-full grid grid-cols-1 gap-3">
      {outputAmount && (
        <div className="bg-gray-700 rounded-lg p-2 mb-1 text-center">
          <span className="text-yellow-400 font-medium">
            {t("common.produces")}: {outputAmount}
          </span>
        </div>
      )}
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
});

export default Ingredients;
