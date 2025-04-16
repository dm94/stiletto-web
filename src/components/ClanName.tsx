import type React from "react";
import { Fragment, memo } from "react";
import { config } from "../config/clientConfig";
import { useTranslation } from "next-i18next";
import type { RelationshipInfo } from "../types/dto/relationship";
import type { ClanInfo } from "../types/dto/clan";

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
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
      <svg
        className="inline-block mr-2"
        width="32"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        aria-label={`Clan color ${clan.flagcolor}`}
      >
        <rect width="90%" height="90%" fill={clan.flagcolor} />
      </svg>
      <span className="inline-block pb-3 text-gray-300">{clan.name}</span>
    </Fragment>
  );
};

export default memo(ClanName);
