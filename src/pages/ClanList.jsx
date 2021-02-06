import React, { Component } from "react";
import LoadingScreen from "../components/LoadingScreen";
import ClanListItem from "../components/ClanListItem";
import ModalMessage from "../components/ModalMessage";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";

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
    Axios.get(process.env.REACT_APP_API_URL + "/clans").then((response) => {
      if (response.status === 202) {
        this.setState({ clans: response.data });
      }
      this.setState({ isLoaded: true });
    });
  }

  sendRequest = (clanid) => {
    Axios.post(
      process.env.REACT_APP_API_URL + "/clans/" + clanid + "/requests",
      {
        data: {
          discordid: localStorage.getItem("discordid"),
          token: localStorage.getItem("token"),
        },
      }
    ).then((response) => {
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

  clanList(t) {
    if (this.state.isLoaded) {
      return (
        <div className="table-responsive">
          <Helmet>
            <title>Clan List - Stiletto</title>
            <meta name="description" content="List of clans" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@dm94dani" />
            <meta name="twitter:title" content="Clan List - Stiletto" />
            <meta name="twitter:description" content="List of clans" />
            <meta
              name="twitter:image"
              content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/timers.jpg"
            />
          </Helmet>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th className="text-center" scope="col">
                  {t("Clan Name")}
                </th>
                <th className="text-center" scope="col">
                  {t("Leader")}
                </th>
                <th className="text-center" scope="col">
                  {t("Discord Invite Link")}
                </th>
                <th className="text-center" scope="col">
                  {t("Actions")}
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
    const { t } = this.props;
    if (this.state.redirect) {
      return (
        <ModalMessage
          message={{
            isError: false,
            text: t("Application to enter the clan sent"),
            redirectPage: "/profile",
          }}
        />
      );
    } else if (this.state.error) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: t(this.state.error),
            redirectPage: "/profile",
          }}
        />
      );
    }
    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      return this.clanList(t);
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

export default withTranslation()(ClanList);
