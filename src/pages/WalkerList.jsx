import React, { Component, Fragment } from "react";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import {
  getMembers,
  getItems,
  getUserProfile,
  getHasPermissions,
} from "../services";
import Pagination from "../components/Pagination";
import WalkerListItem from "../components/WalkerList/WalkerListItem";
const queryString = require("query-string");

class WalkerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      walkers: null,
      redirect: false,
      error: null,
      inputDiscodId: null,
      showLinkDiscordButton: false,
      isFiltered: false,
      discordList: [],
      members: [],
      walkerTypes: [],
      isLeader: false,
      nickname: null,
      page: 1,
      hasMoreWalkers: false,
      searchInput: "",
      walkerTypeSearch: "All",
      searchDescription: "",
      useWalkerSearch: "All",
      hasPermissions: false,
      hasPermissionsBot: false,
      serverDiscordID: null,
      isReadySearch: "All",
    };
  }

  async componentDidMount() {
    if (localStorage.getItem("token") == null) {
      this.setState({ error: "You need to be logged in to view this section" });
      return;
    }

    const parsed = queryString.parse(this.props.location.search);
    if (parsed.code != null) {
      let http = window.location.protocol;
      let slashes = http.concat("//");
      let host = slashes.concat(window.location.hostname);
      const options = {
        method: "get",
        url: process.env.REACT_APP_API_URL + "/walkers/auth",
        params: {
          code: parsed.code,
          redirect:
            host +
            (window.location.port ? ":" + window.location.port : "") +
            "/walkerlist",
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      Axios.request(options)
        .then((response) => {
          if (response.status === 202) {
            this.setState({
              discordList: response.data,
              inputDiscodId:
                response.data != null && response.data.length > 0
                  ? response.data[0].id
                  : "",
            });
          } else if (response.status === 401) {
            this.setState({ error: "Unauthorized" });
          } else if (response.status === 503) {
            this.setState({ error: "Error connecting to database" });
          }
        })
        .catch(() => {
          this.setState({ error: "Error when connecting to the API" });
        });
    }

    const response = await getUserProfile();
    let isLeader = false;
    if (response.success) {
      isLeader = response.message.discordid === response.message.leaderid;
      this.setState({
        clanid: response.message.clanid,
        isLeader: isLeader,
        nickname: response.message.nickname,
        serverDiscordID: response.message.serverdiscord,
      });
    } else {
      this.setState({ error: response.message, isLoaded: true });
    }

    this.updateMembers();
    this.updateWalkerTypes();

    this.updateWalkers();

    let hasPermissions = await getHasPermissions("walkers");
    this.setState({ hasPermissions: hasPermissions });
    let hasPermissionsBot = await getHasPermissions("bot");
    this.setState({ hasPermissions: hasPermissionsBot });
  }

  updateWalkers(page = this.state.page) {
    this.setState({ isLoaded: false, page: page });
    Axios.get(process.env.REACT_APP_API_URL + "/walkers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        pageSize: 20,
        page: page,
        name: this.state.searchInput.length > 0 ? this.state.searchInput : null,
        type:
          this.state.walkerTypeSearch !== "All"
            ? this.state.walkerTypeSearch
            : null,
        desc:
          this.state.searchDescription.length > 0
            ? this.state.searchDescription
            : null,
        use:
          this.state.useWalkerSearch !== "All"
            ? this.state.useWalkerSearch
            : null,
        ready:
          this.state.isReadySearch !== "All"
            ? this.state.isReadySearch === "Yes"
              ? 1
              : 0
            : null,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          let hasMore = response.data != null && response.data.length >= 20;
          this.setState({ walkers: response.data, hasMoreWalkers: hasMore });
        } else if (response.status === 401) {
          this.setState({ error: "The data entered is incorrect" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
        this.setState({ isLoaded: true });
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  }

  async updateMembers() {
    const response = await getMembers();

    if (response.success) {
      this.setState({ members: response.message });
    } else {
      this.setState({ error: response.message });
    }
  }

  async updateWalkerTypes() {
    const response = await getItems();

    if (response != null) {
      let walkerTypeList = response
        .filter((item) => item.name.includes("Walker Body"))
        .map((item) => {
          return item.name.replace("Walker Body", "").trim();
        });
      this.setState({ walkerTypes: walkerTypeList });
    }
  }

  updateWalker = (walker) => {
    const options = {
      method: "put",
      url: process.env.REACT_APP_API_URL + "/walkers/" + walker.walkerID,
      params: {
        owner: walker.ownerUser,
        use: walker.walker_use,
        type: walker.type,
        description: walker.description,
        ready: walker.isReady,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 202) {
          this.componentDidMount();
        } else if (response.status === 401) {
          this.setState({ error: "Unauthorized" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  deleteWalker = (walkerid) => {
    const options = {
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/walkers/" + walkerid,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  walkerList() {
    if (this.state.walkers != null) {
      return this.state.walkers.map((walker) => (
        <WalkerListItem
          key={"witem" + walker.walkerID}
          walker={walker}
          walkerListTypes={this.state.walkerTypes}
          memberList={this.state.members}
          isLeader={this.state.isLeader || this.state.hasPermissions}
          nickname={this.state.nickname}
          onRemove={this.deleteWalker}
          onSave={this.updateWalker}
        />
      ));
    }
  }

  walkerOptionList(t) {
    if (this.state.walkerTypes != null) {
      return this.state.walkerTypes.map((walker) => (
        <option key={walker} value={walker}>
          {t(walker)}
        </option>
      ));
    }
  }

  linkDiscordServer = (event) => {
    event.preventDefault();

    const options = {
      method: "post",
      url: process.env.REACT_APP_API_URL + "/walkers/auth",
      params: {
        discordserverid: this.state.inputDiscodId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        localStorage.removeItem("profile");
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  searchWalkers = (event) => {
    event.preventDefault();
    this.setState({ isFiltered: true, page: 1 }, () => {
      this.updateWalkers();
    });
  };

  clearSearch = (event) => {
    event.preventDefault();
    this.setState({ isFiltered: false, page: 1, searchInput: "" }, () => {
      this.updateWalkers();
    });
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
      (this.state.isLeader || this.state.hasPermissionsBot) &&
      this.state.serverDiscordID == null
    ) {
      if (this.state.discordList != null && this.state.discordList.length > 0) {
        return (
          <div className="row">
            <div className="col-xl-4">
              <div className="card border-secondary mb-3">
                <div className="card-body">
                  <div className="text-info">
                    {t(
                      "For the walkers to appear it is necessary to link the discord server with the clan, only users with administration power can add the discord server."
                    )}
                  </div>
                  <div className="text-warning mb-3">
                    {t(
                      "You can link the discord server more easily by typing !linkserver in your discord server when you have added the bot."
                    )}
                  </div>
                  <form onSubmit={this.linkDiscordServer}>
                    <div className="form-group">
                      <label htmlFor="discordlist">{t("Discord ID")}</label>
                      <select
                        id="discordlist"
                        className="custom-select"
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
        let http = window.location.protocol;
        let slashes = http.concat("//");
        let host = slashes.concat(window.location.hostname);
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
              <div className="card border-secondary mb-3">
                <div className="card-body">
                  <div className="text-info">
                    {t(
                      "For the walkers to appear it is necessary to link the discord server with the clan, only users with administration power can add the discord server."
                    )}
                  </div>
                  <div className="text-warning mb-3">
                    {t(
                      "You can link the discord server more easily by typing !linkserver in your discord server when you have added the bot."
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
        <div className="card border-secondary mb-3">
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

  helmetInfo() {
    return (
      <Helmet>
        <title>Clan Walker List - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="This is the list of all the walkers of your clan"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Walker List - Stiletto for Last Oasis"
        />
        <meta
          name="twitter:description"
          content="This is the list of all the walkers of your clan"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/walkersList.png"
        />
        <link
          rel="canonical"
          href={
            window.location.protocol
              .concat("//")
              .concat(window.location.hostname) +
            (window.location.port ? ":" + window.location.port : "") +
            "/walkerlist"
          }
        />
      </Helmet>
    );
  }

  render() {
    const { t } = this.props;
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
    }
    if (this.state.clanid != null) {
      if (!this.state.isLoaded) {
        return (
          <Fragment>
            {this.helmetInfo()}
            <LoadingScreen />
          </Fragment>
        );
      }
      return (
        <Fragment>
          {this.helmetInfo()}
          {this.serverLinkButton(t)}
          <div className="row">
            <div className="col-md-12">
              <div className="card mb-3 border-primary">
                <div className="card-header">{t("Search Walkers")}</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-xl-2">
                      <label htmlFor="walkerTypeSearch">{t("Type")}</label>
                      <select
                        id="walkerTypeSearch"
                        className="custom-select"
                        value={
                          this.state.walkerTypeSearch
                            ? this.state.walkerTypeSearch
                            : "All"
                        }
                        onChange={(evt) =>
                          this.setState({
                            walkerTypeSearch: evt.target.value,
                          })
                        }
                      >
                        <option value="All">{t("All")}</option>
                        {this.walkerOptionList(t)}
                      </select>
                    </div>
                    <div className="col-xl-2">
                      <label htmlFor="search-name">{t("Name")}</label>
                      <input
                        className="form-control"
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
                    </div>
                    <div className="col-xl-1">
                      <label htmlFor="useWalkerSearch">{t("Use")}</label>
                      <select
                        id="useWalkerSearch"
                        className="custom-select"
                        value={
                          this.state.useWalkerSearch
                            ? this.state.useWalkerSearch
                            : "All"
                        }
                        onChange={(evt) =>
                          this.setState({
                            useWalkerSearch: evt.target.value,
                          })
                        }
                      >
                        <option value="All">{t("All")}</option>
                        <option value="Personal">{t("Personal")}</option>
                        <option value="PVP">{t("PVP")}</option>
                        <option value="Farming">{t("Farming")}</option>
                      </select>
                    </div>
                    <div className="col-xl-2">
                      <label htmlFor="search-description">
                        {t("Description")}
                      </label>
                      <input
                        className="form-control"
                        id="search-description"
                        type="search"
                        aria-label="Search"
                        onChange={(evt) =>
                          this.setState({
                            searchDescription: evt.target.value,
                          })
                        }
                        value={this.state.searchDescription}
                      />
                    </div>
                    <div className="col-xl-1">
                      <label htmlFor="isReadySearch">{t("Is ready?")}</label>
                      <select
                        id="isReadySearch"
                        className="custom-select"
                        value={
                          this.state.isReadySearch
                            ? this.state.isReadySearch
                            : "All"
                        }
                        onChange={(evt) =>
                          this.setState({
                            isReadySearch: evt.target.value,
                          })
                        }
                      >
                        <option value="All">{t("All")}</option>
                        <option value="Yes">{t("Yes")}</option>
                        <option value="No">{t("No")}</option>
                      </select>
                    </div>
                    <div className="col btn-group">
                      <button
                        className="btn btn-lg btn-primary"
                        onClick={(e) => this.updateWalkers()}
                      >
                        {t("Filter walkers")}
                      </button>
                      <button
                        className="btn btn-lg btn-secondary"
                        onClick={() => {
                          this.setState(
                            {
                              searchInput: "",
                              walkerTypeSearch: "All",
                              searchDescription: "",
                              useWalkerSearch: "All",
                            },
                            () => this.updateWalkers()
                          );
                        }}
                      >
                        {t("Clean filter")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <table className="table table-sm">
            <thead>
              <tr>
                <th className="text-center" scope="col">
                  {t("Type")}
                </th>
                <th className="text-center" scope="col">
                  {t("Name")}
                </th>
                <th className="d-none d-sm-table-cell text-center" scope="col">
                  {t("Use")}
                </th>
                <th className="d-none d-sm-table-cell text-center" scope="col">
                  {t("Description")}
                </th>
                <th className="text-center" scope="col">
                  {t("Ready")}
                </th>
                <th className="text-center" scope="col">
                  {t("View")}
                </th>
              </tr>
            </thead>
            <tbody>{this.walkerList()}</tbody>
          </table>
          <Pagination
            currentPage={this.state.page}
            hasMore={this.state.hasMoreWalkers}
            onPrev={() => this.updateWalkers(this.state.page - 1)}
            onNext={() => this.updateWalkers(this.state.page + 1)}
          ></Pagination>
        </Fragment>
      );
    }
    return (
      <ModalMessage
        message={{
          isError: true,
          text: "You need to have a clan to access this section",
          redirectPage: "/profile",
        }}
      />
    );
  }
}

export default withTranslation()(WalkerList);
