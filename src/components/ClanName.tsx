'use client';

import { Fragment } from 'react';
import { config } from '@/config/config';

interface Clan {
  name: string;
  symbol?: string;
  flagcolor: string;
}

interface ClanNameProps {
  clan: Clan;
}

export default function ClanName({ clan }: ClanNameProps) {
  if (clan.symbol) {
    return (
      <Fragment>
        <img
          width="48"
          height="48"
          src={`${config.RESOURCES_URL}/symbols/${clan.symbol}.png`}
          style={{ backgroundColor: clan.flagcolor }}
          alt={clan.symbol}
          id={`symbol-img-${clan.name}`}
        />
        <span className="pb-3 mb-0 ml-2">{clan.name}</span>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <svg
        className="bd-placeholder-img mr-2"
        width="32"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        role="img"
        aria-label={`Clan color ${clan.flagcolor}`}
      >
        <title>{`Color ${clan.flagcolor}`}</title>
        <rect width="90%" height="90%" fill={clan.flagcolor} />
      </svg>
      <span className="pb-3 mb-0">{clan.name}</span>
    </Fragment>
  );
} 