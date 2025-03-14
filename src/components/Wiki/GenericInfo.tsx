"use client";

import { useTranslations } from "next-intl";
import { calcRarityValue } from "@/lib/rarityCalc";

interface GenericInfoProps {
  dataInfo: Record<string, number>;
  name: string;
  rarity: string;
  category: string;
  textColor: string;
}

export const GenericInfo = ({
  dataInfo,
  name,
  rarity,
  category,
  textColor,
}: GenericInfoProps) => {
  const t = useTranslations();

  if (!dataInfo) {
    return null;
  }

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-3">
      <div className="card border-secondary mb-3">
        <div className="card-header">{t(name)}</div>
        <div className="card-body">
          <ul className="list-group">
            {Object.entries(dataInfo).map(([key, originalValue]) => {
              if (!originalValue) {
                return null;
              }

              const value = calcRarityValue(
                rarity,
                key,
                category,
                originalValue
              );
              return (
                <li
                  key={`infolist-${name}-${key}`}
                  className="list-group-item flex justify-between items-center"
                >
                  <div className="my-0 capitalize">{t(key)}</div>
                  <div
                    className={
                      value !== originalValue ? textColor : "text-muted"
                    }
                  >
                    {value}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GenericInfo;
