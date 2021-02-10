import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import WalkerListItem from "../components/WalkerListItem";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { getStyle } from "../BGDarkSyles";
const queryString = require("query-string");

class WalkerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      isLoaded: false,
      walkers: null,
      redirect: false,
      error: null,
      inputDiscodId: "",
      showLinkDiscordButton: false,
      isFiltered: false,
      searchInput: "",
      walkersFiltered: [],
      discordList: [],
    };
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.code != null) {
      var http = window.location.protocol;
      var slashes = http.concat("//");
      var host = slashes.concat(window.location.hostname);
      const options = {
        method: "get",
        url: process.env.REACT_APP_API_URL + "/walkers/auth",
        params: {
          code: parsed.code,
          discordid: this.state.user_discord_id,
          token: this.state.token,
          redirect:
            host +
            (window.location.port ? ":" + window.location.port : "") +
            "/walkerlist",
        },
      };

      Axios.request(options)
        .then((response) => {
          if (response.status === 202) {
            this.setState({ discordList: response.data });
          } else if (response.status === 401) {
            this.setState({ error: "Unauthorized" });
          } else if (response.status === 503) {
            this.setState({ error: "Error connecting to database" });
          }
        })
        .catch((error) => {
          this.setState({ error: "Error when connecting to the API" });
        });
    }
    Axios.get(process.env.REACT_APP_API_URL + "/walkers", {
      params: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
      },
    })
      .then((response) => {
        if (response.status === 202) {
          this.setState({ walkers: response.data });
        } else if (response.status === 401) {
          this.setState({ error: "The data entered is incorrect" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
        this.setState({ isLoaded: true });
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  }

  deleteWalker = (walkerid) => {
    const options = {
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/walkers/" + walkerid,
      params: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 204) {
          this.componentDidMount();
        } else if (response.status === 401) {
          this.setState({ error: "Unauthorized" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  walkerList() {
    if (this.state.isFiltered) {
      return this.state.walkersFiltered.map((walker) => (
        <WalkerListItem
          key={walker.walkerID}
          walker={walker}
          onRemove={this.deleteWalker}
        />
      ));
    } else {
      if (
        this.state.walkers != null &&
        this.state.walkers[0] != null &&
        this.state.walkers[0].discordid != null
      ) {
        return this.state.walkers.map((walker) => (
          <WalkerListItem
            key={walker.walkerID}
            walker={walker}
            onRemove={this.deleteWalker}
          />
        ));
      }
    }
  }

  linkDiscordServer = (event) => {
    event.preventDefault();

    const options = {
      method: "post",
      url: process.env.REACT_APP_API_URL + "/walkers/auth",
      params: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
        discordserverid: this.state.inputDiscodId,
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 202) {
          this.componentDidMount();
        } else if (response.status === 401) {
          this.setState({ error: "Unauthorized" });
        } else if (response.status === 503) {
          this.setState({ error: "Error when connecting with the database" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  searchWalkers = (event) => {
    event.preventDefault();
    let walkersFiltered = this.state.walkers.filter((w) =>
      w.name.toLowerCase().match(this.state.searchInput.toLowerCase())
    );
    this.setState({ walkersFiltered: walkersFiltered, isFiltered: true });
  };

  clearSearch = (event) => {
    event.preventDefault();
    this.setState({ walkersFiltered: [], isFiltered: false, searchInput: "" });
  };

  discordServerList() {
    if (this.state.discordList != null) {
      return this.state.discordList.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ));
    }
  }

  serverLinkButton(t) {
    if (
      this.state.walkers != null &&
      this.state.walkers[0] != null &&
      this.state.walkers[0].discordid == null
    ) {
      if (this.state.walkers[0].leaderid !== this.state.user_discord_id) {
        return;
      }
      if (this.state.discordList != null && this.state.discordList.length > 0) {
        return (
          <div className="row">
            <div className="col-xl-4">
              <div className={getStyle("card border-secondary mb-3")}>
                <div className="card-body">
                  <div className="text-info mb-3">
                    {t(
                      "For the walkers to appear it is necessary to link the discord server with the clan, only users with administration power can add the discord server."
                    )}
                  </div>
                  <form onSubmit={this.linkDiscordServer}>
                    <div className="form-group">
                      <label htmlFor="discordlist">{t("Discord ID")}</label>
                      <select
                        id="discordlist"
                        className={getStyle("custom-select")}
                        value={this.state.inputDiscodId}
                        onChange={(evt) =>
                          this.setState({
                            inputDiscodId: evt.target.value,
                          })
                        }
                        required
                      >
                        {this.discordServerList()}
                      </select>
                    </div>
                    <button
                      className="btn btn-lg btn-outline-success btn-block"
                      type="submit"
                      value="Submit"
                    >
                      {t("Link discord server")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            {this.discordBotSection(t)}
          </div>
        );
      } else {
        var http = window.location.protocol;
        var slashes = http.concat("//");
        var host = slashes.concat(window.location.hostname);
        let urlLink =
          "https://discord.com/api/oauth2/authorize?client_id=" +
          process.env.REACT_APP_DISCORD_CLIENT_ID +
          "&redirect_uri=" +
          host +
          (window.location.port ? ":" + window.location.port : "") +
          "/walkerlist" +
          "&scope=identify%20guilds&response_type=code";
        return (
          <div className="row">
            <div className="col-xl-4">
              <div className={getStyle("card border-secondary mb-3")}>
                <div className="card-body">
                  <div className="text-info mb-3">
                    {t(
                      "For the walkers to appear it is necessary to link the discord server with the clan, only users with administration power can add the discord server."
                    )}
                  </div>
                  <a
                    className="btn btn-lg btn-outline-success btn-block"
                    href={urlLink}
                  >
                    {t("Link discord server")}
                  </a>
                </div>
              </div>
            </div>
            {this.discordBotSection(t)}
          </div>
        );
      }
    }
  }

  discordBotSection(t) {
    return (
      <div className="col-xl-4">
        <div className={getStyle("card border-secondary mb-3")}>
          <div className="card-header">{t("Discord Bot")}</div>
          <div className="card-body">
            <div className="mb-3">
              {t(
                "You need to add the bot to your discord to compile the list of walkers from the log, but it also has other functions like checking what you need to do the different items"
              )}
            </div>

            <a
              className="btn btn-lg btn-outline-success btn-block"
              href="https://top.gg/bot/715948052979908911"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Discord Bot")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    if (this.state.error) {
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
      localStorage.getItem("token") != null &&
      localStorage.getItem("clanid") != "null"
    ) {
      if (!this.state.isLoaded) {
        return <LoadingScreen />;
      }
      return (
        <div>
          <Helmet>
            <title>Walker List - Stiletto</title>
            <meta
              name="description"
              content="This is the list of all the walkers of your clan"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@dm94dani" />
            <meta name="twitter:title" content="Walker List - Stiletto" />
            <meta
              name="twitter:description"
              content="This is the list of all the walkers of your clan"
            />
            <meta
              name="twitter:image"
              content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/walkersList.png"
            />
          </Helmet>
          {this.serverLinkButton(t)}
          <table className={getStyle("table")}>
            <thead>
              <tr>
                <th className="text-center" scope="col">
                  {t("Walker ID")}
                </th>
                <th scope="col">
                  <div className="input-group input-group-sm w-50 mb-0 mx-auto">
                    <input
                      className={getStyle("form-control")}
                      id="search-name"
                      type="search"
                      placeholder="Name.."
                      aria-label="Search"
                      onChange={(evt) =>
                        this.setState({
                          searchInput: evt.target.value,
                        })
                      }
                      value={this.state.searchInput}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => this.searchWalkers(e)}
                      >
                        {t("Search")}
                      </button>
                      <button
                        type="button"
                        className={
                          this.state.isFiltered
                            ? "btn btn-success"
                            : "btn btn-success d-none"
                        }
                        onClick={(e) => this.clearSearch(e)}
                      >
                        {t("Clean")}
                      </button>
                    </div>
                  </div>
                </th>
                <th className="text-center" scope="col">
                  {t("Owner")}
                </th>
                <th className="text-center" scope="col">
                  {t("Last User")}
                </th>
                <th className="text-center" scope="col">
                  {t("Last Use")}
                </th>
              </tr>
            </thead>
            <tbody>{this.walkerList()}</tbody>
          </table>
        </div>
      );
    }
    return (
      <ModalMessage
        message={{
          isError: true,
          text: t("You need to have a clan to access this section"),
          redirectPage: "/profile",
        }}
      />
    );
  }
}

export default withTranslation()(WalkerList);
