import React from "react";
import { useTranslation } from "react-i18next";

interface CraftingTimeProps {
  craftingTime: number | string;
}

const CraftingTime: React.FC<CraftingTimeProps> = ({ craftingTime }) => {
  const { t } = useTranslation();

  if (craftingTime) {
    return (
      <div className="w-full md:w-1/2 px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("wiki.craftingTime")}
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <div className="text-gray-300">{craftingTime}</div>
              <div className="text-gray-400 text-sm">{t("common.seconds")}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CraftingTime;