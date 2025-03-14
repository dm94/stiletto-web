import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Ingredients from "../Ingredients";
import Icon from "../Icon";
import CraftingTime from "../CraftingTime";
import Station from "../Station";
import { getDomain } from "../../functions/utils";

const SelectedItem = ({ item, onChangeCount }) => {
  const [disableEdit, setDisableEdit] = useState(true);
  const { t } = useTranslation();

  const showIngredient = () => {
    if (!item) {
      return null;
    }
    if (!item?.crafting) {
      return null;
    }

    return item.crafting.map((ingredients, i) => (
      <div
        className={`${
          item.crafting.length > 1
            ? "lg:w-1/2 border border-green-500"
            : "w-full"
        } p-4`}
        key={`${item.name}-${item.count}-${i}`}
      >
        <Ingredients
          crafting={ingredients}
          value={
            ingredients.output != null
              ? item.count / ingredients.output
              : item.count
          }
        />
        {ingredients.station && <Station name={ingredients.station} />}
        {ingredients.time && (
          <CraftingTime time={ingredients.time} total={item.count} />
        )}
      </div>
    ));
  };

  const showDamage = () => {
    if (!item?.damage) {
      return null;
    }

    return (
      <div className="w-full text-gray-400 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4">{t("Damage")}</div>
          <div>100% = {item.damage * item.count}</div>
          <div>50% = {item.damage * item.count * 0.5}</div>
          <div>30% = {item.damage * item.count * 0.3}</div>
          <div>10% = {item.damage * item.count * 0.1}</div>
        </div>
      </div>
    );
  };

  const handleChange = (count) => {
    onChangeCount(item.name, Number.parseInt(item.count) + count);
  };

  const url = `${getDomain()}/item/${encodeURI(
    item.name.replaceAll(" ", "_")
  )}`;

  return (
    <div className="w-full">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 text-center relative">
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            aria-label="Remove item"
            onClick={() => onChangeCount(item.name, 0)}
          >
            <span aria-hidden="true">X</span>
          </button>
          <div className="flex items-center justify-center space-x-2">
            <input
              type="number"
              className="w-20 p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={item.count}
              onChange={(e) => onChangeCount(item.name, e.target.value)}
              onMouseEnter={() => setDisableEdit(false)}
              onMouseLeave={() => setDisableEdit(true)}
              min="1"
              max="9999"
              readOnly={disableEdit}
            />
            <div className="flex items-center space-x-2">
              <Icon key={item.name} name={item.name} />
              <a href={url} className="text-blue-400 hover:text-blue-300">
                {t(item.name, { ns: "items" })}
              </a>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap -mx-4">{showIngredient()}</div>
          {showDamage()}
        </div>
        <div className="p-4 bg-gray-900 border-t border-gray-700">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              type="button"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => handleChange(1)}
            >
              +1
            </button>
            <button
              type="button"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => handleChange(10)}
            >
              +10
            </button>
            <button
              type="button"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => handleChange(100)}
            >
              +100
            </button>
            <button
              type="button"
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => handleChange(-1)}
            >
              -1
            </button>
            <button
              type="button"
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => handleChange(-10)}
            >
              -10
            </button>
            <button
              type="button"
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => handleChange(-100)}
            >
              -100
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedItem;
