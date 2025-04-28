import type React from "react";
import { useTranslation } from "react-i18next";
import type { ToolInfo as Info } from "@ctypes/item";
import { calcRarityValue } from "@functions/rarityCalc";

interface ToolInfoProps {
  toolInfo?: Info[];
  rarity?: string;
  textColor?: string;
}

const ToolInfo: React.FC<ToolInfoProps> = ({ toolInfo, rarity, textColor }) => {
  const { t } = useTranslation();

  const showToolInfo = () => {
    return toolInfo?.map((tool) => {
      const value = calcRarityValue(
        rarity,
        "toolTier",
        undefined,
        tool.tier ?? 0,
      );

      return (
        <li
          key={`${tool.toolType}-${value}`}
          className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0"
        >
          {tool?.toolType && (
            <div className="text-gray-300">{t(tool.toolType)}</div>
          )}
          <div className={textColor}>{value}</div>
        </li>
      );
    });
  };

  if (toolInfo) {
    return (
      <div className="w-full md:w-1/2 px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("wiki.toolInfo")}
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
