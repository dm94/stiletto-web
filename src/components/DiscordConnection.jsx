import React, { Component } from "react";
import PrivateProfile from "./PrivateProfile";

const queryString = require("query-string");

class DiscordConnection extends Component {
  state = {};

  showClanInfo() {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.discordid != null && parsed.token != null) {
      auth.authenticate(parsed.discordid, parsed.token);
      localStorage.setItem("discordid", parsed.discordid);
      localStorage.setItem("token", parsed.token);
    } else if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      auth.authenticate(
        localStorage.getItem("discordid"),
        localStorage.getItem("token")
      );
    }

    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      return <PrivateProfile key={auth.discordid} auth={auth} />;
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

const auth = {
  isAuthenticated: false,
  discorduserid: "",
  token: "",
  authenticate(discordid, token) {
    if (discordid != null && token != null) {
      auth.isAuthenticated = true;
      auth.discorduserid = discordid;
      auth.token = token;
    }
  },
};

export default DiscordConnection;
