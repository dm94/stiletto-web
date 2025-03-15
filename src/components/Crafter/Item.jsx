import React from "react";
import { useTranslation } from "react-i18next";

const Item = ({ item, onAdd }) => {
  const { t } = useTranslation();

  if (!item) {
    return null;
  }

  return (
    <div className="p-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors" data-cy="list-group-item">
      <div className="flex items-center justify-between">
        <span className="text-gray-300">{t(item?.name, { ns: "items" })}</span>
        <button
          type="button"
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Add item"
          onClick={() => onAdd(item?.name)}
        >
          <i className="fas fa-plus" />
        </button>
      </div>
    </div>
  );
};

export default Item;
