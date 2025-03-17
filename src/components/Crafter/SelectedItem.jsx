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
            ? "w-full border-l-4 border-green-500"
            : "w-full"
        } p-4 bg-gray-900 rounded-lg relative`}
        key={`${item.name}-${item.count}-${i}`}
      >
        {item.crafting.length > 1 && (
          <div className="absolute top-2 right-2 bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-medium">
            {t("crafting.recipe")} {i + 1}
          </div>
        )}
        <Ingredients
          crafting={ingredients}
          value={
            ingredients.output != null
              ? item.count / ingredients.output
              : item.count
          }
        />
        <div className="mt-4 flex flex-col space-y-2">
          {ingredients.station && <Station name={ingredients.station} />}
          {ingredients.time && (
            <CraftingTime time={ingredients.time} total={item.count} />
          )}
        </div>
      </div>
    ));
  };

  const showDamage = () => {
    if (!item?.damage) {
      return null;
    }

    return (
      <div className="w-full text-gray-300 p-4 bg-gray-900 rounded-lg mt-4 border-l-4 border-red-500">
        <div className="font-semibold text-white mb-3 text-lg">
          {t("common.damage")}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">100%</div>
            <div className="text-red-400 font-bold text-lg">
              {Math.round(item.damage * item.count)}
            </div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">50%</div>
            <div className="text-red-400 font-bold text-lg">
              {Math.round(item.damage * item.count * 0.5)}
            </div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">30%</div>
            <div className="text-red-400 font-bold text-lg">
              {Math.round(item.damage * item.count * 0.3)}
            </div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-400 mb-1">10%</div>
            <div className="text-red-400 font-bold text-lg">
              {Math.round(item.damage * item.count * 0.1)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleChange = (count) => {
    onChangeCount(item.name, Number.parseInt(item.count) + count);
  };

  const url = `${getDomain()}/item/${encodeURI(
    item.name.replaceAll(" ", "_"),
  )}`;

  return (
    <div className="w-full" data-cy="selected-item">
      <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
        <div className="p-4 text-center relative bg-gray-800 border-b border-gray-700">
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
            aria-label={t("common.removeItem")}
            onClick={() => onChangeCount(item.name, 0)}
          >
            <span
              aria-hidden="true"
              className="text-lg font-bold leading-none"
              style={{ marginTop: "-1px" }}
            >
              ×
            </span>
          </button>
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <input
                type="number"
                className="w-24 p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                value={item.count}
                onChange={(e) => onChangeCount(item.name, e.target.value)}
                onMouseEnter={() => setDisableEdit(false)}
                onMouseLeave={() => setDisableEdit(true)}
                min="1"
                max="9999"
                readOnly={disableEdit}
              />
            </div>
            <div className="flex items-center space-x-3">
              <Icon key={item.name} name={item.name} width="48" />
              <a
                href={url}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-xl font-medium"
              >
                {t(item.name, { ns: "items" })}
              </a>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-4">{showIngredient()}</div>
          {showDamage()}
        </div>
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="grid grid-cols-6 gap-2">
            <button
              type="button"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 font-medium"
              onClick={() => handleChange(1)}
            >
              +1
            </button>
            <button
              type="button"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 font-medium"
              onClick={() => handleChange(10)}
            >
              +10
            </button>
            <button
              type="button"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 font-medium"
              onClick={() => handleChange(100)}
            >
              +100
            </button>
            <button
              type="button"
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 font-medium"
              onClick={() => handleChange(-1)}
            >
              -1
            </button>
            <button
              type="button"
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 font-medium"
              onClick={() => handleChange(-10)}
            >
              -10
            </button>
            <button
              type="button"
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 font-medium"
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
