import React from "react";
import { useTranslation } from "react-i18next";
import { isDarkMode } from "../../functions/utils";

const Item = ({ item, onAdd }) => {
  const { t } = useTranslation();

  if (!item) {
    return false;
  }

  return (
    <div
      className={
        isDarkMode()
          ? "list-group-item list-group-item-dark"
          : "list-group-item"
      }
    >
      <div className="row justify-content-between">
        <div className="col-auto">{t(item?.name, { ns: "items" })}</div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-success btn-sm float-right"
            aria-label="Add item"
            onClick={() => onAdd(item?.name)}
          >
            <i className="fas fa-plus" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
