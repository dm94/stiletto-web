"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Icon from "./Icon";
import Ingredients from "./Ingredients";
import { getDomain } from "@/lib/utils";

interface IngredientType {
  name: string;
  count: number;
  ingredients?: {
    ingredients: {
      name: string;
      count: number;
    }[];
    output?: number;
  }[];
}

interface IngredientProps {
  ingredient: IngredientType;
  value: number;
}

export default function Ingredient({ ingredient, value }: IngredientProps) {
  const [showList, setShowList] = useState(false);
  const t = useTranslations();

  const hasIngredients = ingredient.ingredients != null;

  const url = `${getDomain()}/item/${encodeURI(
    ingredient.name.toLowerCase().replaceAll(" ", "_")
  )}`;

  const renderSubList = () => {
    if (showList && ingredient.ingredients != null) {
      return ingredient.ingredients.map((ingredients) => (
        <ul
          className="list-group list-group-horizontal"
          key={`ingredient-sublist-${ingredient.name}-${value}`}
        >
          <span className="sr-only">----------------------------</span>
          <Ingredients
            crafting={ingredients}
            value={
              ingredients.output != null
                ? (ingredient.count * value) / ingredients.output
                : ingredient.count * value
            }
          />
          <span className="sr-only">----------------------------</span>
        </ul>
      ));
    }
    return null;
  };

  return (
    <div className="list-group-item">
      <div
        tabIndex={hasIngredients ? 0 : undefined}
        className={hasIngredients ? "text-success" : ""}
        role={hasIngredients ? "button" : undefined}
        onClick={() => hasIngredients && setShowList(!showList)}
        onKeyUp={(e) => {
          if (hasIngredients && e.key === "Enter") {
            setShowList(!showList);
          }
        }}
      >
        <Icon name={ingredient.name} />
        {ingredient.count != null && value != null
          ? `${Math.ceil(ingredient.count * value)}x `
          : ""}
        {ingredient.ingredients != null ? (
          t(ingredient.name, { ns: "items" })
        ) : (
          <a href={url}>{t(ingredient.name, { ns: "items" })}</a>
        )}
      </div>
      <div className={ingredient.ingredients != null ? "list-group" : ""}>
        {renderSubList()}
      </div>
    </div>
  );
}
