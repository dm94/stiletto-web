import type React from "react";
import { useTranslation } from "react-i18next";
import { calcRarityValue } from "@functions/rarityCalc";
import type { Rarity } from "@ctypes/item";
import { toCamelCase } from "@functions/utils";

interface GenericInfoProps {
  dataInfo: Record<string, unknown>;
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

  const renderContainerCapacity = (
    containerCapacity: number | Record<string, number>,
  ) => {
    if (typeof containerCapacity === "number") {
      return (
        <span className={textColor}>
          {calcRarityValue(
            rarity as Rarity,
            "storage",
            category ?? "",
            containerCapacity,
          )}
        </span>
      );
    }

    return Object.entries(containerCapacity).map(([capacityType, value]) => {
      return (
        <div key={`container-capacity-${capacityType}`}>
          {t(`wiki.containerCapacity.${toCamelCase(capacityType)}`, {
            defaultValue: capacityType,
          })}
          :{" "}
          <span className={textColor}>
            {calcRarityValue(
              rarity as Rarity,
              "storage",
              category ?? "",
              value,
            )}
          </span>
        </div>
      );
    });
  };

  const showValues = () => {
    const items: React.ReactNode[] = [];

    for (const [key, rawValue] of Object.entries(dataInfo)) {
      if (!rawValue) {
        continue;
      }

      const isContainerCapacity = key === "containerCapacity";
      const title = isContainerCapacity
        ? t("wiki.containerCapacity", {
            defaultValue: "Container Capacity",
          })
        : t(key, { defaultValue: key });

      let content: React.ReactNode = t(String(rawValue));
      let valueClassName = "text-gray-400";

      if (isContainerCapacity) {
        content = renderContainerCapacity(
          rawValue as number | Record<string, number>,
        );
        valueClassName = "text-gray-400 text-right";
      } else if (typeof rawValue === "number") {
        const value = calcRarityValue(
          rarity as Rarity,
          key,
          category,
          rawValue,
        );
        content = t(String(value));
        valueClassName = textColor ?? "text-gray-400";
      }

      items.push(
        <li
          key={`infolist-${name}-${key}`}
          className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0"
        >
          <div className="text-gray-300 capitalize">{title}</div>
          <div className={valueClassName}>{content}</div>
        </li>,
      );
    }

    return items;
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
