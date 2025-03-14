import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Ingredient from "../Ingredient";

const CanBeUsedInfo = ({ name, items = [] }) => {
  const { t } = useTranslation();
  const [canBeUsed, setCanBeUsed] = useState([]);

  useEffect(() => {
    if (items && name) {
      const lowerCaseName = name.toLowerCase();
      const filteredItems = items.filter((item) => {
        if (item?.crafting?.[0]?.ingredients) {
          const allIngredients = item.crafting[0].ingredients;
          return allIngredients.some(
            (ingredient) => ingredient.name.toLowerCase() === lowerCaseName,
          );
        }
        return false;
      });
      setCanBeUsed(filteredItems);
    }
  }, [name, items]);

  const showCanBeUsed = () => {
    return canBeUsed.map((item) => (
      <li className="inline-block mr-2 mb-2" key={item.name}>
        <Ingredient
          key={`${item.name}-ingredient`}
          ingredient={item}
          value={1}
        />
      </li>
    ));
  };

  if (name && items && canBeUsed.length > 0) {
    return (
      <div className="w-full md:w-1/2 p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700">
            {t("It can be used in")}
          </div>
          <div className="p-4">
            <ul className="flex flex-wrap -m-2">{showCanBeUsed()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default CanBeUsedInfo;
