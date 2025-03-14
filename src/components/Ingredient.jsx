import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";
import Ingredients from "./Ingredients";
import { getDomain } from "../functions/utils";

const Ingredient = ({ ingredient, value }) => {
  const [showList, setShowList] = useState(false);
  const { t } = useTranslation();

  const hasIngredients =
    ingredient?.ingredients && ingredient?.ingredients.length > 0;

  const url = `${getDomain()}/item/${encodeURI(
    ingredient?.name.toLowerCase().replaceAll(" ", "_"),
  )}`;

  const renderSubList = () => {
    if (
      showList &&
      ingredient?.ingredients &&
      ingredient?.ingredients.length > 0
    ) {
      return ingredient?.ingredients.map((ingredients, index) => (
        <div
          className="mt-3 p-3 bg-gray-700 rounded-lg border-l-2 border-green-500"
          key={`ingredient-sublist-${ingredient?.name}-${value}-${index}`}
        >
          <Ingredients
            crafting={ingredients}
            value={
              ingredients.output != null
                ? (ingredient?.count * value) / ingredients.output
                : ingredient?.count * value
            }
          />
        </div>
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
        onKeyUp={(e) =>
          hasIngredients && e.key === "Enter" && setShowList(!showList)
        }
      >
        <div className="flex-shrink-0 bg-gray-700 p-1 rounded-lg">
          <Icon key={ingredient?.name} name={ingredient?.name} width="36" />
        </div>
        <div className="flex-grow">
          <div className="flex items-center">
            {ingredient?.count != null && value != null && (
              <span className="font-bold mr-2 text-yellow-400 text-lg">
                {Math.ceil(ingredient?.count * value)}×
              </span>
            )}
            {hasIngredients ? (
              <span className="font-medium text-neutral-300">
                {t(ingredient?.name, { ns: "items" })}
              </span>
            ) : (
              <a
                href={url}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                {t(ingredient?.name, { ns: "items" })}
              </a>
            )}
            {hasIngredients && (
              <span className="ml-2 text-gray-400 bg-gray-700 rounded-full w-5 h-5 flex items-center justify-center">
                <i
                  className={`fas fa-chevron-${showList ? "up" : "down"} text-xs`}
                />
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
      <div className={hasIngredients ? "mt-2" : ""}>{renderSubList()}</div>
    </div>
  );
};

export default Ingredient;
