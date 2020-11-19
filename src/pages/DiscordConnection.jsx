import React, { Component } from "react";
import PrivateProfile from "../components/PrivateProfile";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
const queryString = require("query-string");

class DiscordConnection extends Component {
  showClanInfo() {
    const { t } = this.props;
    const parsed = queryString.parse(this.props.location.search);
    let urlLink =
      "https://discord.com/api/oauth2/authorize?client_id=" +
      process.env.REACT_APP_DISCORD_CLIENT_ID +
      "&redirect_uri=" +
      process.env.REACT_APP_API_URL +
      "/discordlogin.php&scope=identify%20guilds&response_type=code";
    if (parsed.discordid != null && parsed.token != null) {
      localStorage.setItem("discordid", parsed.discordid);
      localStorage.setItem("token", parsed.token);
    }

    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      return <PrivateProfile key={localStorage.getItem("discordid")} />;
    } else {
      return (
        <div className="col-xl-6">
          <Helmet>
            <title>Discord Connection - Stiletto</title>
            <meta
              name="description"
              content="Link discord with stiletto and use more functions"
            />
          </Helmet>
          <div className="card border-secondary mb-3">
            <div className="card-body text-succes">
              <a
                className="btn btn-lg btn-outline-primary btn-block"
                href={urlLink}
              >
                <i className="fab fa-discord"></i> {t("Login with discord")}
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return <div className="h-100 container">{this.showClanInfo()}</div>;
  }
}

export default withTranslation()(DiscordConnection);
