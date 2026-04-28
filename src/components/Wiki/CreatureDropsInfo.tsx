import type React from "react";
import { useTranslation } from "react-i18next";
import LanguageLink from "@components/LanguageLink";
import type { Drop } from "@ctypes/item";
import { getItemPath } from "@functions/utils";

interface CreatureDropsInfoProps {
  drops?: Drop[];
}

const CreatureDropsInfo: React.FC<CreatureDropsInfoProps> = ({
  drops = [],
}) => {
  const { t } = useTranslation();

  const showDrops = () => {
    return drops?.map((drop) => {
      const titleInfo = `Drop ${drop?.chance ?? "unknown"}% -> ${
        drop?.minQuantity ?? "unknown"
      }/${drop?.maxQuantity ?? "unknown"}`;
      const dropKey = `${drop.name}-${drop.tier ?? "no-tier"}-${drop.minQuantity ?? "no-min"}-${drop.maxQuantity ?? "no-max"}-${drop.chance ?? "no-chance"}`;
      return (
        <li className="inline-block mr-2 mb-2" key={dropKey} title={titleInfo}>
          <LanguageLink to={getItemPath(drop.name)}>
            <div className="p-2 bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg text-neutral-300 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
              {t(drop.name)} {drop?.tier && `(${drop.tier})`}
            </div>
          </LanguageLink>
        </li>
      );
    });
  };

  if (drops && drops.length > 0) {
    return (
      <div className="w-full md:w-1/2 px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("wiki.drops")}
          </div>
          <div className="p-4">
            <ul className="flex flex-wrap -m-2">{showDrops()}</ul>
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default CreatureDropsInfo;
