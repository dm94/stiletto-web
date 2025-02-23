import React from "react";
import { useTranslation } from "react-i18next";

const ModuleInfo = ({ moduleInfo }) => {
  const { t } = useTranslation();

  if (moduleInfo) {
    return (
      <div className="col-12 col-md-6">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("Module info")}</div>
          <div className="card-body">
            <ul className="list-group">
              {moduleInfo?.max && (
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                  <div className="my-0">{t("Limit per walker")}</div>
                  <div className="text-muted">{moduleInfo.max}</div>
                </li>
              )}
              {moduleInfo?.increase && (
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                  <div className="my-0">{t("Improvement per module")}</div>
                  <div className="text-muted">{moduleInfo.increase}</div>
                </li>
              )}
              {moduleInfo?.maxIncrease && (
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                  <div className="my-0">{t("Maximum improvement")}</div>
                  <div className="text-muted">{moduleInfo.maxIncrease}</div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default ModuleInfo;
