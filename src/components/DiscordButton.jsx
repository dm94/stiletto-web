import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

class DiscordButton extends Component {
  state = {};
  render() {
    const { t } = this.props;
    if (localStorage.getItem("token") != null) {
      return (
        <Link className="btn btn-outline-light" to="/profile">
          <i className="far fa-user"></i> {t("Profile")}
        </Link>
      );
    } else {
      let http = window.location.protocol;
      let slashes = http.concat("//");
      let host = slashes.concat(window.location.hostname);
      let urlLink =
        "https://discord.com/api/oauth2/authorize?client_id=" +
        process.env.REACT_APP_DISCORD_CLIENT_ID +
        "&redirect_uri=" +
        host +
        (window.location.port ? ":" + window.location.port : "") +
        "/profile" +
        "&scope=identify%20guilds&response_type=code";
      return (
        <a className="btn btn-outline-light" href={urlLink}>
          <i className="fab fa-discord"></i> {t("Login with discord")}
        </a>
      );
    }
  }
}

export default withTranslation()(DiscordButton);
