import React from "react";
import { useTranslation } from "react-i18next";

const ModuleInfo = ({ moduleInfo }) => {
  const { t } = useTranslation();

  if (moduleInfo) {
    return (
      <div className="w-full md:w-1/2 p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">{t("Module info")}</div>
          <div className="p-4">
            <ul className="space-y-2">
              {moduleInfo?.max && (
                <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                  <div className="text-gray-300">{t("Limit per walker")}</div>
                  <div className="text-gray-400">{moduleInfo.max}</div>
                </li>
              )}
              {moduleInfo?.increase && (
                <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                  <div className="text-gray-300">{t("Improvement per module")}</div>
                  <div className="text-gray-400">{moduleInfo.increase}</div>
                </li>
              )}
              {moduleInfo?.maxIncrease && (
                <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                  <div className="text-gray-300">{t("Maximum improvement")}</div>
                  <div className="text-gray-400">{moduleInfo.maxIncrease}</div>
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
