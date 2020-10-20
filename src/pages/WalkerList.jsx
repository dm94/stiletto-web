import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import WalkerListItem from "../components/WalkerListItem";
const axios = require("axios");

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
    };
  }

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_API_URL + "/walkers.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ walkers: response.data });
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
        this.setState({ isLoaded: true });
      })
      .catch((error) => {
        this.setState({ error: "Try again later" });
      });
  }

  walkerList() {
    if (this.state.isFiltered) {
      return this.state.walkersFiltered.map((walker) => (
        <WalkerListItem key={walker.walkerID} walker={walker} />
      ));
    } else {
      if (
        this.state.walkers != null &&
        this.state.walkers[0].discordid != null
      ) {
        return this.state.walkers.map((walker) => (
          <WalkerListItem key={walker.walkerID} walker={walker} />
        ));
      }
    }
  }

  linkDiscordServer = (event) => {
    event.preventDefault();
    axios
      .get(process.env.REACT_APP_API_URL + "/walkers.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          accion: "linkdiscordserver",
          dataupdate: this.state.inputDiscodId,
        },
      })
      .then((response) => {
        if (response.status === 202) {
          window.location.href =
            "https://discord.com/api/oauth2/authorize?client_id=" +
            process.env.REACT_APP_DISCORD_CLIENT_ID +
            "&redirect_uri=" +
            process.env.REACT_APP_API_URL +
            "/walkers.php&scope=identify%20guilds&response_type=code";
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
      })
      .catch((error) => {
        this.setState({ error: "Try again later" });
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

  serverLinkButton() {
    if (this.state.walkers != null && !this.state.walkers[0].discordid) {
      return (
        <div className="col-xl-4">
          <div className="card border-secondary mb-3">
            <div className="card-body">
              <div className="text-info mb-3">
                For the walkers to appear it is necessary to link the discord
                server with the clan, only users with administration power can
                add the discord server.
              </div>
              <form onSubmit={this.linkDiscordServer}>
                <div className="form-group">
                  <label htmlFor="discordlist">Discord ID</label>
                  <input
                    className="form-control"
                    type="number"
                    value={this.state.inputDiscodId}
                    onChange={(evt) =>
                      this.setState({
                        inputDiscodId: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button
                  className="btn btn-lg btn-outline-success btn-block"
                  type="submit"
                  value="Submit"
                >
                  Link discord server
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
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
    }
    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      if (!this.state.isLoaded) {
        return <LoadingScreen />;
      }
      return (
        <div>
          {this.serverLinkButton()}
          <table className="table">
            <thead>
              <tr>
                <th className="text-center" scope="col">
                  Walker ID
                </th>
                <th scope="col">
                  <div class="input-group input-group-sm w-50 mb-0 mx-auto">
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
                    <div class="input-group-append">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => this.searchWalkers(e)}
                      >
                        Search
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
                        Clear
                      </button>
                    </div>
                  </div>
                </th>
                <th className="text-center" scope="col">
                  Owner
                </th>
                <th className="text-center" scope="col">
                  Last User
                </th>
                <th className="text-center" scope="col">
                  Last Use
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
          text: "Login to access this section",
          redirectPage: "/profile",
        }}
      />
    );
  }
}

export default WalkerList;
