import React, { Component } from "react";
import PrivateProfile from "../components/PrivateProfile";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
const queryString = require("query-string");

class DiscordConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.code != null) {
      const options = {
        method: "post",
        url: process.env.REACT_APP_API_URL + "/users/auth",
        params: {
          code: parsed.code,
        },
      };

      Axios.request(options).then((response) => {
        if (response.status === 202) {
          if (response.data.discordid != null) {
            localStorage.setItem("discordid", response.data.discordid);
          }
          if (response.data.token != null) {
            localStorage.setItem("token", response.data.token);
          }
          this.setState({
            discordid: response.data.discordid,
            token: response.data.token,
          });
        }
      });
    }
    this.setState({ isLoaded: true });
  }

  showClanInfo() {
    const { t } = this.props;
    const parsed = queryString.parse(this.props.location.search);
    var http = window.location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);
    let urlLink =
      "https://discord.com/api/oauth2/authorize?client_id=" +
      process.env.REACT_APP_DISCORD_CLIENT_ID +
      "&redirect_uri=" +
      host +
      (window.location.port ? ":" + window.location.port : "") +
      "/profile" +
      "&scope=identify%20guilds&response_type=code";
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
        <div className="row">
          <Helmet>
            <title>Discord Connection - Stiletto</title>
            <meta
              name="description"
              content="Link discord with stiletto and use more functions"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@dm94dani" />
            <meta
              name="twitter:title"
              content="Discord Connection - Stiletto"
            />
            <meta
              name="twitter:description"
              content="Link discord with stiletto and use more functions"
            />
            <meta
              name="twitter:image"
              content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
            />
          </Helmet>
          <div className="col-xl-6">
            <div
              className={
                localStorage.getItem("darkmode") !== "true"
                  ? "card border-secondary mb-3"
                  : "card border-secondary mb-3 text-white bg-dark"
              }
            >
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
          <div className="col-xl-6">
            <div
              className={
                localStorage.getItem("darkmode") !== "true"
                  ? "card border-secondary mb-3"
                  : "card border-secondary mb-3 text-white bg-dark"
              }
            >
              <div className="card-body text-succes">
                <button
                  className="btn btn-lg btn-outline-primary btn-block"
                  onClick={() => {
                    localStorage.setItem("discordid", "000000000000000000");
                    localStorage.setItem("token", "test");
                    this.setState({});
                  }}
                >
                  {t("Connect in demo mode")}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    if (this.state.isLoaded) {
      return <div className="h-100 container">{this.showClanInfo()}</div>;
    }
    return <LoadingScreen />;
  }
}

export default withTranslation()(DiscordConnection);
