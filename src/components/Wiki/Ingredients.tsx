import type React from "react";
import { useTranslation } from "next-i18next";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
}

interface IngredientsProps {
  crafting: Ingredient[];
  value: number;
}

const Ingredients: React.FC<IngredientsProps> = ({ crafting, value }) => {
  const { t } = useTranslation();

  if (!crafting) {
    return null;
  }

  return (
    <div className="w-full p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-900 border-b border-gray-700">
          {t("wiki.ingredients")}
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {crafting.map((ingredient) => (
              <li
                key={ingredient.id}
                className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0"
              >
                <div className="text-gray-300">{ingredient.name}</div>
                <div className="text-gray-400">
                  {ingredient.quantity * value}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ingredients;
