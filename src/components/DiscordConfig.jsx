import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class DiscordConfig extends Component {
  state = {
    readClanLog: true,
    botLanguaje: "en",
    automaticKick: false,
    setNotReadyPVP: false,
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
                <label forHTML="botlanguaje">{t("Bot language")}</label>
                <select
                  class="form-control"
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
                onClick={() =>
                  this.setState((state) => {
                    this.setState({ readClanLog: !state.readClanLog });
                  })
                }
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
                />
                <label
                  className="custom-control-label"
                  role="button"
                  forHTML="readClanLog"
                >
                  {t("Read discord clan log.")}
                </label>
              </div>
              <div
                className="custom-control custom-switch my-1"
                onClick={() =>
                  this.setState((state) => {
                    this.setState({ automaticKick: !state.automaticKick });
                  })
                }
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
                />
                <label
                  className="custom-control-label"
                  role="button"
                  forHTML="automaticKick"
                >
                  {t("Automatic kick members from the clan")}
                </label>
              </div>
              <div
                className="custom-control custom-switch my-1"
                onClick={() =>
                  this.setState((state) => {
                    this.setState({ setNotReadyPVP: !state.setNotReadyPVP });
                  })
                }
                role="button"
              >
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="setNotReadyPVP"
                  checked={this.state.setNotReadyPVP}
                />
                <label
                  className="custom-control-label"
                  role="button"
                  forHTML="setNotReadyPVP"
                >
                  {t(
                    "Automatically if a PVP walker is used it is marked as not ready."
                  )}
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
              <button type="button" className="btn btn-primary" disabled>
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
