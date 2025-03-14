"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import ClanName from "./ClanName";

interface Clan {
  clanid: string;
  name: string;
  symbol?: string;
  flagcolor?: string;
  region: string;
  discordTag?: string;
  invitelink?: string;
}

interface ClanListItemProps {
  isLogged?: boolean;
  clanuserid?: string | null;
  clan: Clan;
  onSendRequest?: (clanid: string) => void;
}

export default function ClanListItem({
  isLogged,
  clanuserid,
  clan,
  onSendRequest,
}: ClanListItemProps) {
  const t = useTranslations();

  const renderActionButton = () => {
    if (!isLogged) {
      return null;
    }

    if (clanuserid === null) {
      return (
        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={() => onSendRequest?.(clan.clanid)}
        >
          {t("Send request")}
        </button>
      );
    }

    if (clanuserid === clan.clanid) {
      return (
        <Link href="/members" className="btn btn-primary w-100">
          {t("Members")}
        </Link>
      );
    }

    return null;
  };

  return (
    <tr>
      <td className="ps-3">
        <ClanName clan={clan} />
      </td>
      <td>{clan.region}</td>
      <td>{clan.discordTag}</td>
      <td>
        {clan.invitelink && (
          <a
            href={`https://discord.gg/${clan.invitelink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {clan.invitelink}
          </a>
        )}
      </td>
      <td>{renderActionButton()}</td>
    </tr>
  );
}
