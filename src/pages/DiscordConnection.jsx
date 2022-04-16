import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
import PrivateProfile from "../components/DiscordConnection/PrivateProfile";
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
          window.location.href = window.location.origin;
        } else if (response.status === 401) {
          this.setState({ error: "Unauthorized" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      });
    }
    this.setState({ isLoaded: true });
  }

  showClanInfo() {
    const { t } = this.props;
    const parsed = queryString.parse(this.props.location.search);
    let http = window.location.protocol;
    let slashes = http.concat("//");
    let host = slashes.concat(window.location.hostname);
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
      localStorage.setItem("acceptscookies", true);
    }

    if (localStorage.getItem("token") != null) {
      return <PrivateProfile key="profile" />;
    } else {
      return (
        <div className="row">
          <Helmet>
            <title>Discord Login - Stiletto for Last Oasis</title>
            <meta
              name="description"
              content="Link discord with stiletto and use more functions"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:title"
              content="Discord Login - Stiletto for Last Oasis"
            />
            <meta
              name="twitter:description"
              content="Link discord with stiletto and use more functions"
            />
            <meta
              name="twitter:image"
              content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
            />
            <link
              rel="canonical"
              href={
                window.location.protocol
                  .concat("//")
                  .concat(window.location.hostname) +
                (window.location.port ? ":" + window.location.port : "") +
                "/profile"
              }
            />
          </Helmet>
          <div className="col-12 col-md-6 mx-auto">
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
