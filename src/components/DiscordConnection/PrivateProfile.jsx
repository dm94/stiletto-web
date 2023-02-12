import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { Link } from "react-router-dom";
import { getUserProfile, closeSession, getStoredItem } from "../../services";
import LoadingScreen from "../LoadingScreen";
import ModalMessage from "../ModalMessage";
import Icon from "../Icon";
import ClanConfig from "../ClanConfig";

class PrivateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: getStoredItem("discordid"),
      token: getStoredItem("token"),
      discordtag: "Loading...",
      nickname: "Loading...",
      clanname: "Loading...",
      showDeleteModal: false,
      clanleaderid: null,
      isLoaded: false,
      redirect: false,
      nameInGameInput: "",
      error: null,
      language: getStoredItem("i18nextLng"),
      showClanConfig: false,
    };
  }

  async componentDidMount() {
    const response = await getUserProfile();
    if (response.success) {
      this.setState({
        discordtag: response.message.discordtag,
        clanname: response.message.clanname,
        clanid: response.message.clanid,
        nickname: response.message.nickname,
        clanleaderid: response.message.leaderid,
        user_discord_id: response.message.discordid,
        isLoaded: true,
      });
    } else {
      this.setState({ error: response.message, isLoaded: true });
    }
  }

  deleteUser = (event) => {
    event.preventDefault();
    const options = {
      method: "delete",
      url:
        process.env.REACT_APP_API_URL + "/users/" + this.state.user_discord_id,
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("profile");
        sessionStorage.removeItem("profile");
        localStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList");
        if (response.status === 204) {
          closeSession();
          this.setState({ redirect: true });
        } else if (response.status === 401) {
          closeSession();
          this.setError("Log in again");
        } else if (response.status === 503) {
          this.setError("Error connecting to database");
        }
      })
      .catch(() => {
        this.setConnectionError();
      });
  };

  addNickInGame = (event) => {
    event.preventDefault();

    const options = {
      method: "put",
      url:
        process.env.REACT_APP_API_URL + "/users/" + this.state.user_discord_id,
      params: {
        dataupdate: this.state.nameInGameInput,
      },
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("profile");
        sessionStorage.removeItem("profile");
        localStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList");
        if (response.status === 202) {
          this.setState({ nickname: this.state.nameInGameInput });
        } else if (response.status === 401) {
          closeSession();
          this.setError("Log in again");
        } else if (response.status === 503) {
          this.setError("Error connecting to database");
        }
      })
      .catch(() => {
        this.setConnectionError();
      });
  };

  leaveClan = (event) => {
    event.preventDefault();

    const options = {
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/clans",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("profile");
        sessionStorage.removeItem("profile");
        localStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList");
        if (response.status === 204) {
          this.setState({ clanname: null });
        } else if (response.status === 401) {
          closeSession();
          this.setError("Log in again");
        } else if (response.status === 503) {
          this.setError("Error connecting to database");
        }
      })
      .catch(() => {
        this.setConnectionError();
      });
  };

  changeLanguage = () => {
    i18next.changeLanguage(this.state.language);
  };

  setConnectionError = () => {
    this.setError("Error when connecting to the API");
  };

  setError = (error) => {
    const { t } = this.props;
    this.setState({ error: t(error) });
  };

  showClanSection() {
    const { t } = this.props;
    const showHideClassName = this.state.showDeleteModal
      ? "modal d-block"
      : "modal d-none";

    if (getStoredItem("token") != null && !this.state.redirect) {
      return (
        <div className="row">
          <Helmet>
            <title>{t("Profile")} - Stiletto for Last Oasis</title>
            <meta
              name="description"
              content="Private profile where you can configure some things"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:title"
              content="Perfil - Stiletto for Last Oasis"
            />
            <meta
              name="twitter:description"
              content="Private profile where you can configure some things"
            />
            <meta
              name="twitter:image"
              content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg"
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
          {this.state.showClanConfig ? (
            <ClanConfig
              key="clanconfig"
              clanid={this.state.clanid}
              onClose={() => {
                this.setState({ showClanConfig: false });
                localStorage.removeItem("profile");
                sessionStorage.removeItem("profile");
                this.componentDidMount();
              }}
              onError={(error) => this.setState({ error: error })}
            />
          ) : (
            ""
          )}
          <div className="col-xl-6">
            <div className="card border-secondary mb-3">
              <div className="card-header">{t("Your details")}</div>
              <div className="card-body">
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Discord Tag")}</div>
                    <div className="text-muted" data-cy="discord-tag">
                      {this.state.discordtag}
                    </div>
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Nick in Game")}</div>
                    <div className="text-muted">
                      {this.state.nickname != null
                        ? this.state.nickname
                        : t("Not defined")}
                    </div>
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
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
                  className="btn btn-lg btn-warning btn-block"
                  onClick={() => {
                    closeSession();
                    this.setState({ redirect: true });
                  }}
                >
                  {t("Close session")}
                </button>
                <button
                  type="button"
                  className="btn btn-lg btn-danger btn-block"
                  onClick={this.showModal}
                >
                  {t("Delete user")}
                </button>
              </div>
            </div>
          </div>
          <div className={showHideClassName}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteusermodal">
                    {t("Are you sure?")}
                  </h5>
                </div>
                <div className="modal-body">
                  <p>
                    {t(
                      "This option is not reversible, your user and all his data will be deleted."
                    )}
                  </p>
                  <p>
                    {t(
                      "The administrator will be notified to delete the user, the user will not be deleted directly."
                    )}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={this.hideModal}
                  >
                    {t("Cancel")}
                  </button>
                  <button className="btn btn-danger" onClick={this.deleteUser}>
                    {t("Delete user")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {this.changeNamePart(t)}
          {this.manageClanPart(t)}
          <div className="col-xl-6">
            <div className="card border-secondary mb-3">
              <div className="card-body">
                <Link className="btn btn-lg btn-secondary btn-block" to="/maps">
                  {t("Resource Maps")}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card border-secondary mb-3">
              <div className="card-header">{t("Change language")}</div>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <select
                      id="changeLanguajeSelect"
                      className="custom-select"
                      value={this.state.language}
                      onChange={(evt) =>
                        this.setState({
                          language: evt.target.value,
                        })
                      }
                    >
                      <option value="zh">{t("Chinese Simplified")}</option>
                      <option value="en">{t("English")}</option>
                      <option value="fr">{t("French")}</option>
                      <option value="de">{t("German")}</option>
                      <option value="it">{t("Italian")}</option>
                      <option value="jp">{t("Japanese")}</option>
                      <option value="pl">{t("Polish")}</option>
                      <option value="pt">{t("Portuguese, Brazilian")}</option>
                      <option value="ru">{t("Russian")}</option>
                      <option value="es">{t("Spanish")}</option>
                      <option value="uk">{t("Ukrainian")}</option>
                    </select>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-primary"
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
      return (
        <ModalMessage
          message={{
            isError: true,
            text: "Login again",
            redirectPage: "/",
          }}
        />
      );
    }
  }

  changeNamePart(t) {
    if (this.state.nickname == null || this.state.nickname === "Loading...") {
      return (
        <div className="col-xl-6">
          <div className="card border-secondary mb-3">
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
                  className="btn btn-lg btn-success btn-block"
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
          <div className="card border-secondary mb-3">
            <div className="card-header">
              <Link
                className="btn btn-lg btn-info btn-block"
                to="/clanlist"
                data-cy="join-clan-btn"
              >
                {t("Join a clan")}
              </Link>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-lg btn-success btn-block"
                data-cy="create-clan-btn"
                onClick={() => {
                  this.setState({ showClanConfig: true });
                }}
              >
                {t("Create a clan")}
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-xl-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Manage Clan")}</div>
            <div className="card-body">
              <Link
                className="btn btn-lg btn-secondary btn-block"
                to="/members"
              >
                <i className="fas fa-users"></i> {t("Members")}
              </Link>
              <Link
                className="btn btn-lg btn-secondary btn-block"
                to="/walkerlist"
              >
                <Icon key="Base Wings" name="Base Wings" width="30" />
                {t("Walker List")}
              </Link>
              <Link
                className="btn btn-lg btn-secondary btn-block"
                to="/diplomacy"
              >
                <i className="far fa-flag"></i> {t("Diplomacy")}
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
            className="btn btn-lg btn-danger btn-block"
            data-cy="leave-clan-btn"
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
