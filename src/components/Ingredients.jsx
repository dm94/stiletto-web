import React from "react";
import Ingredient from "./Ingredient";

const Ingredients = ({ crafting, value }) => {
  if (!crafting?.ingredients) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {crafting.ingredients.map((ingredient) => (
        <div 
          key={ingredient.name} 
          className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
        >
          <Ingredient ingredient={ingredient} value={value} />
        </div>
      ))}
    </div>
  );
};

export default Ingredients;
