import React, { Component } from "react";
import ModalMessage from "./ModalMessage";
import LoadingScreen from "./LoadingScreen";

const axios = require("axios");

class ClanMaps extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      clanid: localStorage.getItem("clanid"),
      isLoaded: true,
      maps: null,
      error: null,
    };
  }

  render() {
    if (this.state.error) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: this.state.error,
            redirectPage: "/profile",
          }}
        />
      );
    } else if (
      this.state.clanid == null ||
      this.state.user_discord_id == null ||
      this.state.token == null
    ) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: "You do not have permission to access this page",
            redirectPage: "/profile",
          }}
        />
      );
    }

    if (!this.state.isLoaded) {
      return <LoadingScreen />;
    }

    return <div></div>;
  }
}

export default ClanMaps;
