import React, { Component } from "react";
import LoadingScreen from "./LoadingScreen";
import { BrowserRouter as Router, Link, Redirect } from "react-router-dom";

const axios = require("axios");

class PrivateProfile extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      urlApi: "https://api.comunidadgzone.es/v1/users",
      discordtag: "Loading...",
      nickname: "Loading...",
      clanname: "Loading...",
      clanid: 0,
      showDeleteModal: false,
      clanleaderid: null,
      isLoaded: false,
      redirect: false,
      nameInGameInput: "",
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
          this.setState({ redirect: true });
        }
        this.setState({ isLoaded: true });
      });
  }

  deleteUser = (event) => {
    event.preventDefault();
    if (event != null) {
      axios
        .delete(
          this.state.urlApi +
            "?discordid=" +
            this.state.user_discord_id +
            "&token=" +
            this.state.token
        )
        .then(localStorage.clear())
        .then(this.setState({ redirect: true }));
    }
  };

  addNickInGame = (event) => {
    event.preventDefault();
    if (event != null) {
      axios
        .get(this.state.urlApi, {
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
          console.error(error);
        });
    }
  };

  leaveClan = (event) => {
    event.preventDefault();
    if (event != null) {
      axios
        .get(this.state.urlApi, {
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
          console.error(error);
        });
    }
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
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true"></span>
                  </button>
                </div>
                <div className="modal-body">
                  This option is not reversible, your user and all his data will
                  be deleted.
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={this.hideModal}
                  >
                    Cancel
                  </button>
                  <form method="POST" id="deleteUserForm" action="">
                    <input type="hidden" name="accion" value="delete_user" />
                    <button
                      className="btn btn-lg btn-outline-danger btn-block g-recaptcha"
                      onClick={this.deleteUser}
                    >
                      Delete user
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {this.changeNamePart()}
          {this.manageClanPart()}
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
              <div className="form-group">
                <label htmlFor="user_game_name">Your name in Last Oasis</label>
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
                />
              </div>
              <button
                className="btn btn-lg btn-outline-success btn-block"
                onClick={this.addNickInGame}
              >
                Add
              </button>
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
            <div className="card-header">Add clan</div>
            <div className="card-body text-succes">
              <Link
                className="btn btn-lg btn-outline-info btn-block"
                to="/clanlist"
              >
                Join a clan
              </Link>
              <Link
                className="btn btn-lg btn-outline-warning btn-block"
                to="/addclan"
              >
                Create a clan
              </Link>
              <p className="text-muted text-center">
                Only valid if you are the owner of the some discord
              </p>
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
            </div>
            {this.leaveClanButton}
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
            Leave the clan
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
    return this.state.isLoaded ? this.showClanSection() : <LoadingScreen />;
  }
}

export default PrivateProfile;
