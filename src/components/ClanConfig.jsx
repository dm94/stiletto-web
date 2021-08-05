import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Axios from "axios";
import { closeSession } from "../services";

class ClanConfig extends Component {
  state = {
    addClanNameInput: "",
    addClanColorInput: "",
    addClanDiscordInput: "",
    clanFlagSymbolInput: "",
  };

  componentDidMount() {
    const options = {
      method: "get",
      url: process.env.REACT_APP_API_URL + "/clans/" + this.props.clanid,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    Axios.request(options)
      .then((response) => {
        if (response.status === 200) {
          if (response.data != null) {
            this.setState({
              addClanNameInput: response.data.name,
              addClanColorInput: response.data.flagcolor,
              addClanDiscordInput: response.data.invitelink,
              clanFlagSymbolInput: response.data.symbol,
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

  updateClan = () => {
    const options = {
      method: "put",
      url: process.env.REACT_APP_API_URL + "/clans/" + this.props.clanid,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        clanname: this.state.addClanNameInput,
        clancolor: this.state.addClanColorInput,
        clandiscord: this.state.addClanDiscordInput,
        symbol: this.state.clanFlagSymbolInput,
      },
    };
    Axios.request(options)
      .then((response) => {
        if (response.status === 200) {
          this.props.onClose();
        } else if (response.status === 401) {
          this.props.onClose();
          closeSession();
          this.props.onError("You don't have access here, try to log in again");
        } else if (response.status === 503) {
          this.props.onClose();
          this.props.onError("Error connecting to database");
        }
      })
      .catch(() => {
        this.props.onClose();
        this.props.onError("Error when connecting to the API");
      });
  };

  symbolsList() {
    const symbols = [];
    for (let i = 1; i < 31; i++) {
      symbols.push("C" + i);
    }
    return symbols.map((symbol) => (
      <div className="col-3" key={"symbol-" + symbol}>
        <img
          src={
            process.env.REACT_APP_API_GENERAL_URL +
            "/symbols/" +
            symbol +
            ".png"
          }
          className={
            symbol === this.state.clanFlagSymbolInput
              ? "img-fluid img-thumbnail"
              : "img-fluid"
          }
          alt={symbol}
          id={"symbol-img-" + symbol}
          onClick={() => this.setState({ clanFlagSymbolInput: symbol })}
        />
      </div>
    ));
  }

  render() {
    const { t } = this.props;
    return (
      <div className="modal d-block" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{t("Clan Configuration")}</h5>
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
              <div className="form-group">
                <label htmlFor="sigilClanFlagInput">{t("Symbol")}</label>
                <div className="col-12">
                  <div className="row">{this.symbolsList()}</div>
                </div>
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
                onClick={this.updateClan}
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

export default withTranslation()(ClanConfig);
