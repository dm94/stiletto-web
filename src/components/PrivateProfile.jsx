import React, { Component } from "react";
import LoadingScreen from "./LoadingScreen";
import { BrowserRouter as Router, Link, Redirect } from "react-router-dom";
import ModalMessage from "./ModalMessage";
import { withTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import { getStyle } from "../BGDarkSyles";
import Axios from "axios";

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
      language: localStorage.getItem("i18nextLng"),
    };
  }

  componentDidMount() {
    Axios.get(
      process.env.REACT_APP_API_URL + "/users/" + this.state.user_discord_id,
      {
        params: {
          token: this.state.token,
        },
      }
    )
      .then((response) => {
        if (response.status === 202) {
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
          this.setError("This user cannot be found");
        }
        this.setState({ isLoaded: true });
      })
      .catch((er) => {
        this.setConnectionError();
      });
  }

  deleteUser = (event) => {
    event.preventDefault();
    Axios.delete(
      process.env.REACT_APP_API_URL + "/users/" + this.state.user_discord_id,
      {
        data: {
          token: this.state.token,
        },
      }
    )
      .then((response) => {
        localStorage.clear();
        this.setState({ redirect: true });
      })
      .catch((error) => {
        this.setConnectionError();
      });
  };

  addNickInGame = (event) => {
    event.preventDefault();
    Axios.put(
      process.env.REACT_APP_API_URL + "/users/" + this.state.user_discord_id,
      {
        data: {
          token: this.state.token,
          dataupdate: this.state.nameInGameInput,
        },
      }
    )
      .then((response) => {
        this.setState({ nickname: this.state.nameInGameInput });
      })
      .catch((error) => {
        this.setConnectionError();
      });
  };

  leaveClan = (event) => {
    event.preventDefault();
    Axios.delete(process.env.REACT_APP_API_URL + "/clans", {
      data: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
      },
    })
      .then((response) => {
        this.setState({ clanname: null });
      })
      .catch((error) => {
        this.setConnectionError();
      });
  };

  createClan = () => {
    Axios.post(process.env.REACT_APP_API_URL + "/clans", {
      data: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
        clanname: this.state.addClanNameInput,
        clancolor: this.state.addClanColorInput,
        clandiscord: this.state.addClanDiscordInput,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          this.componentDidMount();
        } else if (response.status === 401) {
          localStorage.clear();
          this.setError("This user cannot be found");
        }
      })
      .catch((error) => {
        this.setConnectionError();
      });
  };

  changeLanguage = () => {
    i18next.changeLanguage(this.state.language);
  };

  setConnectionError() {
    this.setError("Error when connecting to the API");
  }

  setError(error) {
    const { t } = this.props;
    this.setState({ error: t(error) });
  }

  showClanSection() {
    const { t } = this.props;
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
          <Helmet>
            <title>Perfil - Stiletto</title>
            <meta
              name="description"
              content="Private profile where you can configure some things"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@dm94dani" />
            <meta name="twitter:title" content="Perfil - Stiletto" />
            <meta
              name="twitter:description"
              content="Private profile where you can configure some things"
            />
            <meta
              name="twitter:image"
              content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg"
            />
          </Helmet>
          <div className="col-xl-6">
            <div className={getStyle("card border-secondary mb-3")}>
              <div className="card-header">{t("Your details")}</div>
              <div className="card-body text-secondary">
                <ul className="list-group mb-3">
                  <li className={getStyle("listitem-profile")}>
                    <div className="my-0">{t("Discord Tag")}</div>
                    <div className="text-muted">{this.state.discordtag}</div>
                  </li>
                  <li className={getStyle("listitem-profile")}>
                    <div className="my-0">{t("Nick in Game")}</div>
                    <div className="text-muted">
                      {this.state.nickname != null
                        ? this.state.nickname
                        : t("Not defined")}
                    </div>
                  </li>
                  <li className={getStyle("listitem-profile")}>
                    <div className="my-0">{t("Clan")}</div>
                    <div className="text-muted">
                      {this.state.clanname != null
                        ? this.state.clanname
                        : t("No Clan")}
                    </div>
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                <button
                  type="button"
                  className="btn btn-lg btn-outline-warning btn-block"
                  onClick={() => {
                    localStorage.clear();
                    this.setState({ redirect: true });
                  }}
                >
                  {t("Close session")}
                </button>
                <button
                  type="button"
                  className="btn btn-lg btn-outline-danger btn-block"
                  onClick={this.showModal}
                >
                  {t("Delete user")}
                </button>
              </div>
            </div>
          </div>
          <div className={showHideClassName}>
            <div className="modal-dialog">
              <div className={getStyle("modal-content")}>
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteusermodal">
                    {t("Are you sure?")}
                  </h5>
                </div>
                <div className="modal-body">
                  {t(
                    "This option is not reversible, your user and all his data will be deleted."
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={this.hideModal}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={this.deleteUser}
                  >
                    {t("Delete user")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {this.changeNamePart(t)}
          {this.manageClanPart(t)}
          <div className="col-xl-6">
            <div className={getStyle("card border-secondary mb-3")}>
              <div className="card-body">
                <Link
                  className="btn btn-lg btn-outline-secondary btn-block"
                  to="/maps"
                >
                  {t("Resources maps")}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className={getStyle("card border-secondary mb-3")}>
              <div className="card-header">{t("Change language")}</div>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <select
                      id="changeLanguajeSelect"
                      className={getStyle("custom-select")}
                      value={this.state.language}
                      onChange={(evt) =>
                        this.setState({
                          language: evt.target.value,
                        })
                      }
                    >
                      <option value="en">{t("English")}</option>
                      <option value="es">{t("Spanish")}</option>
                      <option value="ru">{t("Russian")}</option>
                      <option value="fr">{t("French")}</option>
                    </select>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-outline-primary"
                      onClick={this.changeLanguage}
                    >
                      {t("Change language")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" from="/clan" />;
    }
  }

  changeNamePart(t) {
    if (this.state.nickname == null || this.state.nickname === "Loading...") {
      return (
        <div className="col-xl-6">
          <div className={getStyle("card border-secondary mb-3")}>
            <div className="card-header">{t("Add name in the game")}</div>
            <div className="card-body text-succes">
              <form onSubmit={this.addNickInGame}>
                <div className="form-group">
                  <label htmlFor="user_game_name">
                    {t("Your name in Last Oasis")}
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
                  {t("Add")}
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }

  manageClanPart(t) {
    if (this.state.clanname == null || this.state.clanname === "Loading...") {
      return (
        <div className="col-xl-6">
          <div className={getStyle("card border-secondary mb-3")}>
            <div className="card-header">
              <Link className="btn btn-lg btn-info btn-block" to="/clanlist">
                {t("Join a clan")}
              </Link>
            </div>
            <div className="card-body text-succes">
              <form onSubmit={this.createClan}>
                <div className="form-group">
                  <label htmlFor="clan_name">{t("Clan Name")}</label>
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
                  <label htmlFor="flag_color">{t("Flag Color")}</label>
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
                    {t("Discord Invite Link")} {t("(Optional)")}
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
                  {t("Create a clan")}
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-xl-6">
          <div className={getStyle("card border-secondary mb-3")}>
            <div className="card-header">{t("Manage Clan")}</div>
            <div className="card-body">
              <Link
                className="btn btn-lg btn-outline-secondary btn-block"
                to="/members"
              >
                {t("Members")}
              </Link>
              <Link
                className="btn btn-lg btn-outline-secondary btn-block"
                to="/walkerlist"
              >
                {t("Walker List")}
              </Link>
              <Link
                className="btn btn-lg btn-outline-secondary btn-block"
                to="/diplomacy"
              >
                {t("Diplomacy")}
              </Link>
            </div>
            {this.leaveClanButton(t)}
          </div>
        </div>
      );
    }
  }

  leaveClanButton(t) {
    if (this.state.clanleaderid !== this.state.user_discord_id) {
      return (
        <div className="card-footer">
          <button
            className="btn btn-lg btn-outline-danger btn-block"
            onClick={this.leaveClan}
          >
            {t("Leave clan")}
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

export default withTranslation()(PrivateProfile);
