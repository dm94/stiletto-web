import React from "react";
import { useTranslation } from "react-i18next";
import { calcRarityValue } from "../../rarityCalc";

const GenericInfo = ({ dataInfo, name, rarity, category, textColor }) => {
  const { t } = useTranslation();

  const showValues = () => {
    return Object.keys(dataInfo).map((key) => {
      if (dataInfo[key]) {
        const value = calcRarityValue(rarity, key, category, dataInfo[key]);
        return (
          <li
            key={`infolist-${name}-${key}`}
            className="list-group-item d-flex justify-content-between lh-condensed"
          >
            <div className="my-0 text-capitalize">{t(key)}</div>
            <div className={value !== dataInfo[key] ? textColor : "text-muted"}>
              {value}
            </div>
          </li>
        );
      }
      return false;
    });
  };

  if (dataInfo) {
    return (
      <div className="col-12 col-md-6 col-xl-3">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t(name)}</div>
          <div className="card-body">
            <ul className="list-group">{showValues()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default GenericInfo;
