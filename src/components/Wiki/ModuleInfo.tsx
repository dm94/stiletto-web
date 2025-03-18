import React from "react";
import { useTranslation } from "react-i18next";

interface ModuleInfoData {
  max?: number;
  increase?: number | string;
  maxIncrease?: number | string;
}

interface ModuleInfoProps {
  moduleInfo?: ModuleInfoData;
}

const ModuleInfo: React.FC<ModuleInfoProps> = ({ moduleInfo }) => {
  const { t } = useTranslation();

  if (!moduleInfo) {
    return null;
  }

  return (
    <div className="w-full md:w-1/2 px-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
          {t("wiki.moduleInfo")}
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {moduleInfo?.max && (
              <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                <div className="text-gray-300">{t("wiki.limitPerWalker")}</div>
                <div className="text-gray-400">{moduleInfo.max}</div>
              </li>
            )}
            {moduleInfo?.increase && (
              <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                <div className="text-gray-300">
                  {t("wiki.improvementPerModule")}
                </div>
                <div className="text-gray-400">{moduleInfo.increase}</div>
              </li>
            )}
            {moduleInfo?.maxIncrease && (
              <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                <div className="text-gray-300">
                  {t("wiki.maximumImprovement")}
                </div>
                <div className="text-gray-400">{moduleInfo.maxIncrease}</div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModuleInfo;