import React from "react";
import { useTranslation } from "react-i18next";

const Item = ({ item, onAdd }) => {
  const { t } = useTranslation();

  if (!item) {
    return false;
  }

  return (
    <div className={"list-group-item list-group-item-dark"}>
      <div className="row">
        <div className="col-auto">{t(item?.name, { ns: "items" })}</div>
        <div className="col">
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
