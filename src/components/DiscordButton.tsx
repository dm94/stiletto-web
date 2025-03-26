import type React from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { getStoredItem } from "@functions/services";
import { getDomain } from "@functions/utils";
import { config } from "@config/config";

const DiscordButton: React.FC = () => {
  const { t } = useTranslation();

  if (getStoredItem("token")) {
    return (
      <Link
        className="px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        to="/profile"
        data-cy="profile-link"
      >
        <i className="far fa-user mr-2" /> {t("menu.profile")}
      </Link>
    );
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${
    config.REACT_APP_DISCORD_CLIENT_ID
  }&redirect_uri=${getDomain()}/profile&scope=identify%20guilds&response_type=code`;

  return (
    <a
      className="px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      href={discordAuthUrl}
    >
      <i className="fab fa-discord mr-2" /> {t("auth.loginWithDiscord")}
    </a>
  );
};

export default DiscordButton;
