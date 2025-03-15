import React from "react";
import { Link } from "react-router";
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
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => onSendRequest(clan.clanid)}
          >
            {t("Send request")}
          </button>
        );
      }
      if (clanuserid === clan.clanid) {
        return (
          <Link
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center block"
            to="/members"
          >
            {t("Members")}
          </Link>
        );
      }
    }
    return null;
  };

  return (
    <tr className="hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <ClanName key={clan.name} clan={clan} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
        {clan.region}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
        {clan.discordTag}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <a
          href={`https://discord.gg/${clan.invitelink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          {clan.invitelink}
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {sendRequestButton()}
      </td>
    </tr>
  );
};

export default ClanListItem;
