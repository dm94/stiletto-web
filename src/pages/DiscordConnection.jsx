import React, { Component } from "react";
import PrivateProfile from "../components/PrivateProfile";

const queryString = require("query-string");

class DiscordConnection extends Component {
  showClanInfo() {
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
        <a className="btn btn-lg btn-outline-primary btn-block" href={urlLink}>
          <i className="fab fa-discord"></i>Login with discord
        </a>
      );
    }
  }

  render() {
    return <div className="h-100 container">{this.showClanInfo()}</div>;
  }
}

export default DiscordConnection;
