import type React from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { getDomain } from "@functions/utils";
import { config } from "@config/config";
import { useUser } from "@store/userStore";
import { FaUser, FaDiscord } from "react-icons/fa";

const DiscordButton: React.FC = () => {
  const { t } = useTranslation();
  const { isConnected } = useUser();

  if (isConnected) {
    return (
      <Link
        className="px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        to="/profile"
        data-testid="profile-link"
      >
        <FaUser className="mr-2" /> {t("menu.profile")}
      </Link>
    );
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${
    config.DISCORD_CLIENT_ID
  }&redirect_uri=${getDomain()}/profile&scope=identify%20guilds&response_type=code`;

  return (
    <a
      className="px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      href={discordAuthUrl}
    >
      <FaDiscord className="mr-2 inline align-middle" />{" "}
      {t("auth.loginWithDiscord")}
    </a>
  );
};

export default DiscordButton;
