import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";

interface StationProps {
  name: string;
}

const Station: React.FC<StationProps> = ({ name }) => {
  const { t } = useTranslation();

  if (!name) {
    return null;
  }

  return (
    <div className="flex items-center justify-end space-x-2 text-gray-300">
      <span>{t("crafting.madeOn")}</span>
      <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
        <Icon key={name} name={name} width="24" />
        <span className="font-medium">{t(name)}</span>
      </div>
    </div>
  );
};

export default Station;