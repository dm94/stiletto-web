import React from "react";
import { useTranslation } from "react-i18next";

const ToolInfo = ({ toolInfo }) => {
  const { t } = useTranslation();

  const showToolInfo = () => {
    return toolInfo?.map((tool) => (
      <li
        key={tool.toolType + tool.tier}
        className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0"
      >
        <div className="text-gray-300">{t(tool.toolType)}</div>
        <div className="text-gray-400">{tool.tier}</div>
      </li>
    ));
  };

  if (toolInfo) {
    return (
      <div className="w-full md:w-1/2 p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("Tool info")}
          </div>
          <div className="p-4">
            <ul className="space-y-2">{showToolInfo()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default ToolInfo;
