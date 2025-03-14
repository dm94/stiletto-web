import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";
import Ingredients from "./Ingredients";
import { getDomain } from "../functions/utils";

const Ingredient = ({ ingredient, value }) => {
  const [showList, setShowList] = useState(false);
  const { t } = useTranslation();

  const hasIngredients = ingredient?.ingredients != null;

  const url = `${getDomain()}/item/${encodeURI(
    ingredient?.name.toLowerCase().replaceAll(" ", "_")
  )}`;

  const renderSubList = () => {
    if (showList && ingredient?.ingredients != null) {
      return ingredient?.ingredients.map((ingredients) => (
        <ul
          className="flex flex-wrap gap-2 p-3 bg-gray-700 rounded-lg mt-3"
          key={`ingredient-sublist-${ingredient?.name}-${value}`}
        >
          <span className="sr-only">----------------------------</span>
          <Ingredients
            crafting={ingredients}
            value={
              ingredients.output != null
                ? (ingredient?.count * value) / ingredients.output
                : ingredient?.count * value
            }
          />
          <span className="sr-only">----------------------------</span>
        </ul>
      ));
    }
    return "";
  };

  return (
    <div className="w-full">
      <div
        tabIndex={hasIngredients ? 0 : undefined}
        className={`flex items-center space-x-3 ${
          hasIngredients 
            ? "text-green-400 cursor-pointer hover:text-green-300 transition-colors duration-200" 
            : ""
        }`}
        role={hasIngredients ? "button" : undefined}
        onClick={() => hasIngredients && setShowList(!showList)}
        onKeyUp={(e) => hasIngredients && e.key === "Enter" && setShowList(!showList)}
      >
        <div className="flex-shrink-0">
          <Icon key={ingredient?.name} name={ingredient?.name} width="48" />
        </div>
        <div className="flex-grow">
          <div className="flex items-center">
            {ingredient?.count != null && value != null && (
              <span className="font-bold mr-2 text-yellow-400">
                {Math.ceil(ingredient?.count * value)}x
              </span>
            )}
            {ingredient?.ingredients != null ? (
              <span className="font-medium">{t(ingredient?.name, { ns: "items" })}</span>
            ) : (
              <a 
                href={url} 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                {t(ingredient?.name, { ns: "items" })}
              </a>
            )}
            {hasIngredients && (
              <span className="ml-2 text-gray-400">
                <i className={`fas fa-chevron-${showList ? 'up' : 'down'}`} />
              </span>
            )}
          </div>
          {ingredient?.category && (
            <div className="text-sm text-gray-400 mt-1">
              {t(ingredient.category)}
            </div>
          )}
        </div>
      </div>
      <div className={ingredient?.ingredients != null ? "mt-2" : ""}>
        {renderSubList()}
      </div>
    </div>
  );
};

export default Ingredient;
