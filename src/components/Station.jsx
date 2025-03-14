import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";

const Station = ({ name }) => {
  const { t } = useTranslation();

  if (!name) {
    return false;
  }

  return (
    <div className="text-right mb-0 text-gray-400">
      {t("made on")} <Icon key={name} name={name} /> {t(name)}
    </div>
  );
};

export default Station;
