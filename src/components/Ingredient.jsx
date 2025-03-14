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
          className="flex flex-wrap gap-2 p-2 bg-gray-700 rounded-lg"
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
    <div className="p-2 border-b border-gray-700 last:border-b-0">
      <div
        tabIndex={hasIngredients ? 0 : undefined}
        className={`flex items-center space-x-2 ${hasIngredients ? "text-green-400 cursor-pointer hover:text-green-300" : ""}`}
        role={hasIngredients ? "button" : ""}
        onClick={() => setShowList(!showList)}
        onKeyUp={() => setShowList(!showList)}
      >
        <Icon key={ingredient?.name} name={ingredient?.name} />
        {ingredient?.count != null && value != null
          ? `${Math.ceil(ingredient?.count * value)}x `
          : ""}
        {ingredient?.ingredients != null ? (
          t(ingredient?.name, { ns: "items" })
        ) : (
          <a href={url} className="text-blue-400 hover:text-blue-300">{t(ingredient?.name, { ns: "items" })}</a>
        )}
      </div>
      <div className={ingredient?.ingredients != null ? "mt-2" : ""}>
        {renderSubList()}
      </div>
    </div>
  );
};

export default Ingredient;
