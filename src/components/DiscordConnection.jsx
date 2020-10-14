import React, { Component } from "react";
import PrivateProfile from "./PrivateProfile";

const queryString = require("query-string");

class DiscordConnection extends Component {
  state = {};

  showClanInfo() {
    const parsed = queryString.parse(this.props.location.search);
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
        <a
          className="btn btn-lg btn-outline-primary btn-block"
          href="https://discord.com/api/oauth2/authorize?client_id=762652181382823946&redirect_uri=https://api.comunidadgzone.es/v1/discordlogin.php&scope=identify%20guilds&response_type=code"
        >
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
