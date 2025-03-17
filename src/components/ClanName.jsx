import React, { Fragment } from "react";
import { config } from "../config/config";
import { useTranslation } from "react-i18next";

const ClanName = ({ clan }) => {
  const { t } = useTranslation();

  if (clan?.symbol) {
    return (
      <Fragment>
        <img
          width="48"
          height="48"
          src={`${config.REACT_APP_RESOURCES_URL}/symbols/${clan.symbol}.png`}
          style={{ backgroundColor: clan.flagcolor }}
          alt={t("diplomacy.symbol")}
          id={`symbol-img-${clan.name}`}
          className="inline-block rounded"
        />
        <span className="inline-block pb-3 ml-2 text-gray-300">
          {clan.name}
        </span>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <svg
        className="inline-block mr-2"
        width="32"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        role="img"
        aria-label={`Clan color ${clan.flagcolor}`}
        title={`Color ${clan.flagcolor}`}
      >
        <rect width="90%" height="90%" fill={clan.flagcolor} />
      </svg>
      <span className="inline-block pb-3 text-gray-300">{clan.name}</span>
    </Fragment>
  );
};

export default ClanName;
