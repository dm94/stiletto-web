import React, { Component } from "react";
import LoadingScreen from "./LoadingScreen";
import { BrowserRouter as Router, Link, Redirect } from "react-router-dom";
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
      redirect: false,
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
          this.setState({ clans: response.data });
        }
        this.setState({ isLoaded: true });
      });
  }

  sendRequest = (clanid) => {
    axios
      .get(this.state.urlApi, {
        params: {
          discordid: localStorage.getItem("discordid"),
          token: localStorage.getItem("token"),
          dataupdate: clanid,
          accion: "sendrequest",
        },
      })
      .then((response) => {
        this.setState({ redirect: true });
      });
  };

  list() {
    if (this.state.clans != null) {
      return this.state.clans.map((clan) => (
        <ClanListItem
          key={clan.name}
          clan={clan}
          onSendRequest={this.sendRequest}
        />
      ));
    }
  }

  clanList() {
    if (this.state.isLoaded) {
      return (
        <table className="table">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                Clan Name
              </th>
              <th className="text-center" scope="col">
                Leader
              </th>
              <th className="text-center" scope="col">
                Discord Invite Link
              </th>
              <th className="text-center" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{this.list()}</tbody>
        </table>
      );
    } else {
      return <LoadingScreen />;
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/profile" />;
    }
    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      return this.clanList();
    }
    return <Redirect to="/profile" />;
  }
}

export default ClanList;
