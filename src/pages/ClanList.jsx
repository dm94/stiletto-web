import React, { Component } from "react";
import LoadingScreen from "../components/LoadingScreen";
import ClanListItem from "../components/ClanListItem";
import ModalMessage from "../components/ModalMessage";
const axios = require("axios");

class ClanList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      isLoaded: false,
      clans: null,
      redirect: false,
      error: null,
    };
  }

  componentDidMount() {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/clans.php" +
          "?discordid=" +
          this.state.user_discord_id +
          "&token=" +
          this.state.token
      )
      .then((response) => {
        if (response.status === 200) {
          this.setState({ clans: response.data });
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
        this.setState({ isLoaded: true });
      });
  }

  sendRequest = (clanid) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
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
          key={clan.clanid}
          clan={clan}
          onSendRequest={this.sendRequest}
        />
      ));
    }
  }

  clanList() {
    if (this.state.isLoaded) {
      return (
        <div className="table-responsive">
          <table className="table">
            <thead className="thead-light">
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
        </div>
      );
    } else {
      return <LoadingScreen />;
    }
  }

  render() {
    if (this.state.redirect) {
      return (
        <ModalMessage
          message={{
            isError: false,
            text: "Application to enter the clan sent",
            redirectPage: "/profile",
          }}
        />
      );
    } else if (this.state.error) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: this.state.error,
            redirectPage: "/profile",
          }}
        />
      );
    }
    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      return this.clanList();
    }
    return (
      <ModalMessage
        message={{
          isError: true,
          text: "Login to access this section",
          redirectPage: "/profile",
        }}
      />
    );
  }
}

export default ClanList;
