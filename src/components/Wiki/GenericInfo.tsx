import type React from "react";
import { useTranslation } from "react-i18next";
import { calcRarityValue } from "@functions/rarityCalc";

interface GenericInfoProps {
  dataInfo: Record<string, any>;
  name: string;
  rarity?: string;
  category?: string;
  textColor?: string;
}

const GenericInfo: React.FC<GenericInfoProps> = ({
  dataInfo,
  name,
  rarity,
  category,
  textColor,
}) => {
  const { t } = useTranslation();

  const showValues = () => {
    return Object.keys(dataInfo).map((key) => {
      if (dataInfo[key]) {
        const value = calcRarityValue(rarity, key, category, dataInfo[key]);
        return (
          <li
            key={`infolist-${name}-${key}`}
            className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0"
          >
            <div className="text-gray-300 capitalize">{t(key)}</div>
            <div
              className={value !== dataInfo[key] ? textColor : "text-gray-400"}
            >
              {value}
            </div>
          </li>
        );
      }
      return null;
    });
  };

  if (dataInfo && Object.keys(dataInfo)?.length > 0) {
    return (
      <div className="w-full md:w-1/2 px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t(name)}
          </div>
          <div className="p-4">
            <ul className="space-y-2">{showValues()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GenericInfo;
