import type React from "react";
import { useTranslation } from "react-i18next";
import type { CreatureCompleteInfo } from "@ctypes/creature";

interface CreatureInfoProps {
  creatureInfo?: CreatureCompleteInfo;
}

const CreatureInfo: React.FC<CreatureInfoProps> = ({ creatureInfo }) => {
  const { t } = useTranslation();

  const showCreatureInfo = () => {
    if (!creatureInfo) {
      return null;
    }

    return (
      <ul className="space-y-2">
        {creatureInfo.category && (
          <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div className="text-gray-300">{t("common.category")}</div>
            <div className="text-gray-400">
              {t(creatureInfo.category, { ns: "creatures" })}
            </div>
          </li>
        )}
        {creatureInfo.health && (
          <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div className="text-gray-300">{t("creature.health")}</div>
            <div className="text-gray-400">{creatureInfo.health}</div>
          </li>
        )}
        {creatureInfo.experiencie && (
          <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div className="text-gray-300">{t("creature.experience")}</div>
            <div className="text-gray-400">{creatureInfo.experiencie}</div>
          </li>
        )}
        {creatureInfo.tier && (
          <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
            <div className="text-gray-300">{t("creature.tier")}</div>
            <div className="text-gray-400">{creatureInfo.tier}</div>
          </li>
        )}
      </ul>
    );
  };

  if (creatureInfo) {
    return (
      <div className="w-full md:w-1/2 px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("creature.info")}
          </div>
          <div className="p-4">{showCreatureInfo()}</div>
        </div>
      </div>
    );
  }

  return false;
};

export default CreatureInfo;
