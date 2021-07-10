import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Axios from "axios";
import { closeSession } from "../services";

class DiscordConfig extends Component {
  state = {
    readClanLog: true,
    botLanguaje: "en",
    automaticKick: false,
    setNotReadyPVP: false,
    walkeralarm: false,
  };

  componentDidMount() {
    const options = {
      method: "get",
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.props.clanid +
        "/discordbot",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    Axios.request(options)
      .then((response) => {
        if (response.status === 200) {
          if (response.data != null) {
            this.setState({
              botLanguaje: response.data.botlanguaje
                ? response.data.botlanguaje
                : "en",
              readClanLog: response.data.readclanlog === "1" ? true : false,
              automaticKick: response.data.automatickick === "1" ? true : false,
              setNotReadyPVP:
                response.data.setnotreadypvp === "1" ? true : false,
              walkeralarm: response.data.walkeralarm === "1" ? true : false,
            });
          }
        } else if (response.status === 401) {
          closeSession();
          this.props.onError("You don't have access here, try to log in again");
        } else if (response.status === 503) {
          this.props.onError("Error connecting to database");
        }
      })
      .catch(() => {
        this.props.onError("Error when connecting to the API");
      });
  }

  updateBotConfig = () => {
    const options = {
      method: "put",
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.props.clanid +
        "/discordbot",
      params: {
        languaje: this.state.botLanguaje,
        clanlog: this.state.readClanLog,
        kick: this.state.automaticKick,
        readypvp: this.state.setNotReadyPVP,
        walkeralarm: this.state.walkeralarm,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    Axios.request(options)
      .then((response) => {
        if (response.status === 200) {
          this.props.onClose();
        } else if (response.status === 401) {
          closeSession();
          this.props.onError("You don't have access here, try to log in again");
          this.props.onClose();
        } else if (response.status === 503) {
          this.props.onError("Error connecting to database");
          this.props.onClose();
        }
      })
      .catch(() => {
        this.props.onError("Error when connecting to the API");
      });
  };

  render() {
    const { t } = this.props;
    return (
      <div className="modal d-block" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t("Discord Bot Configuration")}</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => this.props.onClose()}
              >
                <span aria-hidden="true">X</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="botlanguaje">{t("Bot language")}</label>
                <select
                  className="form-control"
                  value={this.state.botLanguaje}
                  id="botlanguaje"
                  onChange={(evt) =>
                    this.setState({ botLanguaje: evt.target.value })
                  }
                >
                  <option value="en">{t("English")}</option>
                  <option value="es">{t("Spanish")}</option>
                  <option value="ru">{t("Russian")}</option>
                  <option value="fr">{t("French")}</option>
                  <option value="de">{t("German")}</option>
                </select>
              </div>
              <div
                className="custom-control custom-switch my-1"
                role="button"
                title={t(
                  "If you want the bot to read the clan log, it is necessary for other functions."
                )}
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="readClanLog"
                  checked={this.state.readClanLog}
                  onChange={() =>
                    this.setState((state) => {
                      this.setState({ readClanLog: !state.readClanLog });
                    })
                  }
                />
                <label
                  className="custom-control-label"
                  role="button"
                  htmlFor="readClanLog"
                >
                  {t("Read discord clan log.")}
                </label>
              </div>
              <div
                className="custom-control custom-switch my-1"
                role="button"
                title={t(
                  "Read the clan log and if a member was kicked, kick from here too."
                )}
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="automaticKick"
                  checked={this.state.automaticKick}
                  onChange={() =>
                    this.setState((state) => {
                      this.setState({ automaticKick: !state.automaticKick });
                    })
                  }
                />
                <label
                  className="custom-control-label"
                  role="button"
                  htmlFor="automaticKick"
                >
                  {t("Automatic kick members from the clan")}
                </label>
              </div>
              <div className="custom-control custom-switch my-1" role="button">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="setNotReadyPVP"
                  checked={this.state.setNotReadyPVP}
                  onChange={() =>
                    this.setState((state) => {
                      this.setState({ setNotReadyPVP: !state.setNotReadyPVP });
                    })
                  }
                />
                <label
                  className="custom-control-label"
                  role="button"
                  htmlFor="setNotReadyPVP"
                >
                  {t(
                    "Automatically if a PVP walker is used it is marked as not ready."
                  )}
                </label>
              </div>
              <div
                className="custom-control custom-switch my-1"
                role="button"
                title={t(
                  "Read the clan log and if a member was kicked, kick from here too."
                )}
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="walkerAlarm"
                  checked={this.state.walkeralarm}
                  onChange={() =>
                    this.setState((state) => {
                      this.setState({ walkeralarm: !state.walkeralarm });
                    })
                  }
                />
                <label
                  className="custom-control-label"
                  role="button"
                  htmlFor="walkerAlarm"
                >
                  {t("Warns if someone brings out a walker they don't own.")}
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.props.onClose()}
              >
                {t("Close")}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.updateBotConfig}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(DiscordConfig);
