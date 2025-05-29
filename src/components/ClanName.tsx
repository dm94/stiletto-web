import type React from "react";
import { Fragment, memo } from "react";
import { config } from "@config/config";
import { useTranslation } from "react-i18next";
import type { RelationshipInfo } from "@ctypes/dto/relationship";
import type { ClanInfo } from "@ctypes/dto/clan";

interface ClanNameProps {
  clan: RelationshipInfo | ClanInfo;
}

const ClanName: React.FC<ClanNameProps> = ({ clan }) => {
  const { t } = useTranslation();

  if (clan?.symbol) {
    return (
      <Fragment>
        <img
          width="48"
          height="48"
          src={`${config.RESOURCES_URL}/symbols/${clan.symbol}.png`}
          style={{ backgroundColor: clan.flagcolor }}
          alt={`${t("diplomacy.symbol")} of ${clan.name}`}
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
      >
        <title>{t("clan.flagColorTitle", { clanName: clan.name, color: clan.flagcolor })}</title>
        <rect width="90%" height="90%" fill={clan.flagcolor} />
      </svg>
      <span className="inline-block pb-3 text-gray-300">{clan.name}</span>
    </Fragment>
  );
};

export default memo(ClanName);
