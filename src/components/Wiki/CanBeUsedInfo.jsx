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
      <li className="list-inline-item" key={item.name}>
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
      <div className="col-12 col-md-6">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("It can be used in")}</div>
          <div className="card-body">
            <ul className="list-inline">{showCanBeUsed()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default CanBeUsedInfo;
