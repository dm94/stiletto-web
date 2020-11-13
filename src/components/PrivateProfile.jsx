import React, { Component } from "react";
import LoadingScreen from "./LoadingScreen";
import { BrowserRouter as Router, Link, Redirect } from "react-router-dom";
import ModalMessage from "./ModalMessage";

const axios = require("axios");

class PrivateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      discordtag: "Loading...",
      nickname: "Loading...",
      clanname: "Loading...",
      clanid: localStorage.getItem("clanid"),
      showDeleteModal: false,
      clanleaderid: null,
      isLoaded: false,
      redirect: false,
      nameInGameInput: "",
      error: null,
      addClanNameInput: "",
      addClanColorInput: "",
      addClanDiscordInput: "",
    };
  }

  componentDidMount() {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/users.php" +
          "?discordid=" +
          this.state.user_discord_id +
          "&token=" +
          this.state.token
      )
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("clanid", response.data.clanid);
          this.setState({
            discordtag: response.data.discordtag,
            clanname: response.data.clanname,
            clanid: response.data.clanid,
            nickname: response.data.nickname,
            clanleaderid: response.data.leaderid,
            isLoaded: true,
          });
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({ error: "This user cannot be found" });
        }
        this.setState({ isLoaded: true });
      })
      .catch((er) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  }

  deleteUser = (event) => {
    event.preventDefault();
    axios
      .delete(
        process.env.REACT_APP_API_URL +
          "/users.php" +
          "?discordid=" +
          this.state.user_discord_id +
          "&token=" +
          this.state.token
      )
      .then(localStorage.clear())
      .then(this.setState({ redirect: true }));
  };

  addNickInGame = (event) => {
    event.preventDefault();
    axios
      .get(process.env.REACT_APP_API_URL + "/users.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          dataupdate: this.state.nameInGameInput,
          accion: "changeusergamename",
        },
      })
      .then((response) => {
        this.setState({ nickname: this.state.nameInGameInput });
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  leaveClan = (event) => {
    event.preventDefault();
    axios
      .get(process.env.REACT_APP_API_URL + "/users.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          accion: "leavetheclan",
        },
      })
      .then((response) => {
        this.setState({ clanname: null });
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  createClan = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          accion: "createclan",
          clanname: this.state.addClanNameInput,
          clancolor: this.state.addClanColorInput,
          clandiscord: this.state.addClanDiscordInput,
        },
      })
      .then((response) => {
        if (response.status === 202) {
          this.componentDidMount();
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({ error: "This user cannot be found" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  showClanSection() {
    let showHideClassName = this.state.showDeleteModal
      ? "modal d-block"
      : "modal d-none";
    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null &&
      !this.state.redirect
    ) {
      return (
        <div className="row">
          <div className="col-xl-6">
            <div className="card border-secondary mb-3">
              <div className="card-header">Your details</div>
              <div className="card-body text-secondary">
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">Discord Tag</div>
                    <div className="text-muted">{this.state.discordtag}</div>
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">Nick in Game</div>
                    <div className="text-muted">
                      {this.state.nickname != null
                        ? this.state.nickname
                        : "Not defined"}
                    </div>
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">Clan</div>
                    <div className="text-muted">
                      {this.state.clanname != null
                        ? this.state.clanname
                        : "No Clan"}
                    </div>
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                <button
                  type="button"
                  className="btn btn-lg btn-outline-danger btn-block"
                  onClick={this.showModal}
                >
                  Delete user
                </button>
              </div>
            </div>
          </div>
          <div className={showHideClassName}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteusermodal">
                    Are you sure?
                  </h5>
                </div>
                <div className="modal-body">
                  This option is not reversible, your user and all his data will
                  be deleted.
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={this.hideModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={this.deleteUser}
                  >
                    Delete user
                  </button>
                </div>
              </div>
            </div>
          </div>
          {this.changeNamePart()}
          {this.manageClanPart()}
          <div className="col-xl-6">
            <div className="card border-secondary mb-3">
              <div className="card-body">
                <Link
                  className="btn btn-lg btn-outline-secondary btn-block"
                  to="/maps"
                >
                  Resources Maps
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" from="/clan" />;
    }
  }

  changeNamePart() {
    if (this.state.nickname == null || this.state.nickname === "Loading...") {
      return (
        <div className="col-xl-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">Add name in the game</div>
            <div className="card-body text-succes">
              <form onSubmit={this.addNickInGame}>
                <div className="form-group">
                  <label htmlFor="user_game_name">
                    Your name in Last Oasis
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="nameInGameInput"
                    value={this.state.nameInGameInput}
                    onChange={(evt) =>
                      this.setState({
                        nameInGameInput: evt.target.value,
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
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }

  manageClanPart() {
    if (this.state.clanname == null || this.state.clanname === "Loading...") {
      return (
        <div className="col-xl-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">
              <Link className="btn btn-lg btn-info btn-block" to="/clanlist">
                Join a clan
              </Link>
            </div>
            <div className="card-body text-succes">
              <form onSubmit={this.createClan}>
                <div className="form-group">
                  <label htmlFor="clan_name">Clan Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="clan_name"
                    name="clan_name"
                    maxLength="20"
                    value={this.state.addClanNameInput}
                    onChange={(evt) =>
                      this.setState({
                        addClanNameInput: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="flag_color">Flag Color</label>
                  <input
                    type="color"
                    className="form-control"
                    id="flag_color"
                    name="flag_color"
                    value={this.state.addClanColorInput}
                    onChange={(evt) =>
                      this.setState({
                        addClanColorInput: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="discord_invite">
                    Discord Link Invite (Optional)
                  </label>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        https://discord.gg/
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="discord_invite"
                      name="discord_invite"
                      maxLength="10"
                      value={this.state.addClanDiscordInput}
                      onChange={(evt) =>
                        this.setState({
                          addClanDiscordInput: evt.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  className="btn btn-lg btn-outline-success btn-block"
                  type="submit"
                  value="Submit"
                >
                  Create a clan
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-xl-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">Manage Clan</div>
            <div className="card-body">
              <Link
                className="btn btn-lg btn-outline-secondary btn-block"
                to="/members"
              >
                Clan Members
              </Link>
              <Link
                className="btn btn-lg btn-outline-secondary btn-block"
                to="/walkerlist"
              >
                Walker list
              </Link>
              <Link
                className="btn btn-lg btn-outline-secondary btn-block"
                to="/diplomacy"
              >
                Diplomacy
              </Link>
            </div>
            {this.leaveClanButton()}
          </div>
        </div>
      );
    }
  }

  leaveClanButton() {
    if (this.state.clanleaderid !== this.state.user_discord_id) {
      return (
        <div className="card-footer">
          <button
            className="btn btn-lg btn-outline-danger btn-block"
            onClick={this.leaveClan}
          >
            Leave clan
          </button>
        </div>
      );
    }
  }

  showModal = () => {
    this.setState({ showDeleteModal: true });
  };

  hideModal = () => {
    this.setState({ showDeleteModal: false });
  };

  render() {
    if (this.state.error) {
      return (
        <ModalMessage
          message={{ isError: true, text: this.state.error, redirectPage: "/" }}
        />
      );
    }
    return this.state.isLoaded ? this.showClanSection() : <LoadingScreen />;
  }
}

export default PrivateProfile;
