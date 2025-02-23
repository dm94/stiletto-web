import React from "react";
import { useTranslation } from "react-i18next";

const DropsInfo = ({ drops = [] }) => {
  const { t } = useTranslation();

  const showDrops = () => {
    return drops?.map((drop, index) => {
      const titleInfo = `Drop ${drop?.chance ?? "unknown"}% -> ${
        drop?.minQuantity ?? "unknown"
      }/${drop?.maxQuantity ?? "unknown"}`;
      return (
        <li
          className="list-inline-item"
          key={`${drop.location}-${index}`}
          title={titleInfo}
        >
          <p className="list-group-item">{t(drop.location)}</p>
        </li>
      );
    });
  };

  if (drops) {
    return (
      <div className="col-12 col-md-6">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("Obtainable from")}</div>
          <div className="card-body">
            <ul className="list-inline">{showDrops()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default DropsInfo;
