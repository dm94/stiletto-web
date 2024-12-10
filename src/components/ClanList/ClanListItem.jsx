import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ClanName from "../ClanName";

const ClanListItem = ({ isLogged, clanuserid, clan, onSendRequest }) => {
  const { t } = useTranslation();

  const sendRequestButton = () => {
    if (isLogged) {
      if (clanuserid == null) {
        return (
          <button
            type="button"
            className="btn btn-block btn-primary"
            onClick={() => onSendRequest(clan.clanid)}
          >
            {t("Send request")}
          </button>
        );
      }
      if (clanuserid === clan.clanid) {
        return (
          <Link className="btn btn-block btn-primary" to="/members">
            {t("Members")}
          </Link>
        );
      }
    }
    return false;
  };

  return (
    <tr>
      <td className="pl-3">
        <ClanName key={clan.name} clan={clan} />
      </td>
      <td>{clan.region}</td>
      <td>{clan.discordTag}</td>
      <td>
        <a
          href={`https://discord.gg/${clan.invitelink}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {clan.invitelink}
        </a>
      </td>
      <td>{sendRequestButton()}</td>
    </tr>
  );
};

export default ClanListItem;
