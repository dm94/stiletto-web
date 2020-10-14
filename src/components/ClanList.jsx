import React, { Component } from "react";
import LoadingScreen from "./LoadingScreen";
import { BrowserRouter as Redirect } from "react-router-dom";
import ClanListItem from "./ClanListItem";
const axios = require("axios");

class ClanList extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      urlApi: "https://api.comunidadgzone.es/v1/clans",
      isLoaded: false,
      clans: null,
    };
  }

  componentDidMount() {
    axios
      .get(
        this.state.urlApi +
          "?discordid=" +
          this.state.user_discord_id +
          "&token=" +
          this.state.token
      )
      .then((response) => {
        if (response.status === 200) {
          this.setState({ clans: response.data, isLoaded: true });
        }
      });
  }

  list() {
    return (
      <table class="table">
        <thead>
          <tr>
            <th class="text-center" scope="col">
              Clan Name
            </th>
            <th class="text-center" scope="col">
              Leader
            </th>
            <th class="text-center" scope="col">
              Discord Invite Link
            </th>
            <th class="text-center" scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.clans.map((clanListItem) => (
            <ClanListItem key={clanListItem.clanid} clan={clanListItem} />
          ))}
        </tbody>
      </table>
    );
  }

  clanList() {
    return this.state.isLoaded ? this.list() : <LoadingScreen />;
  }

  render() {
    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      this.clanList();
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default ClanList;
