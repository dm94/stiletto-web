import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { getStoredItem } from "../services";
import { getDomain } from "../functions/utils";
import { config } from "../config/config";

class DiscordButton extends Component {
  state = {};
  render() {
    const { t } = this.props;
    if (getStoredItem("token") != null) {
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
    const urlLink = `https://discord.com/api/oauth2/authorize?client_id=${
      config.REACT_APP_DISCORD_CLIENT_ID
    }&redirect_uri=${getDomain()}/profile&scope=identify%20guilds&response_type=code`;

    return (
      <a className="btn btn-outline-light" href={urlLink}>
        <i className="fab fa-discord" /> {t("Login with discord")}
      </a>
    );
  }
}

export default withTranslation()(DiscordButton);
