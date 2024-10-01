import React from "react";
import { useTranslation } from "react-i18next";

const ToolInfo = ({ toolInfo }) => {
  const { t } = useTranslation();

  const showToolInfo = () => {
    return toolInfo?.map((tool) => (
      <li
        key={tool.toolType + tool.tier}
        className="list-group-item d-flex justify-content-between lh-condensed"
      >
        <div className="my-0">{t(tool.toolType)}</div>
        <div className="text-muted">{tool.tier}</div>
      </li>
    ));
  };

  if (toolInfo) {
    return (
      <div className="col-12 col-md-6 col-xl-3">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("Tool info")}</div>
          <div className="card-body">
            <ul className="list-group">{showToolInfo()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default ToolInfo;
