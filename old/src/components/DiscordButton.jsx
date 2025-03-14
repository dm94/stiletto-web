import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStoredItem } from "../functions/services";
import { getDomain } from "../functions/utils";
import { config } from "../config/config";

const DiscordButton = () => {
  const { t } = useTranslation();

  if (getStoredItem("token")) {
    return (
      <Link
        className="btn btn-outline-light"
        to="/profile"
        data-cy="profile-link"
      >
        <i className="far fa-user" /> {t("Profile")}
      </Link>
    );
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${
    config.REACT_APP_DISCORD_CLIENT_ID
  }&redirect_uri=${getDomain()}/profile&scope=identify%20guilds&response_type=code`;

  return (
    <a className="btn btn-outline-light" href={discordAuthUrl}>
      <i className="fab fa-discord" /> {t("Login with discord")}
    </a>
  );
};

export default DiscordButton;
