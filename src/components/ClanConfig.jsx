import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Axios from "axios";
import { closeSession, getStoredItem } from "../services";
import ClusterList from "./ClusterList";

class ClanConfig extends Component {
  state = {
    addClanNameInput: "",
    addClanColorInput: "#000000",
    addClanDiscordInput: "",
    clanFlagSymbolInput: "C1",
    regionInput: "EU-Official",
    recruitInput: true,
  };

  componentDidMount() {
    if (this.props?.clanid) {
      const options = {
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/clans/${this.props?.clanid}`,
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
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
                regionInput: response.data.region,
                recruitInput: response.data.recruitment,
              });
            }
          } else if (response.status === 401) {
            closeSession();
            this.props?.onError(
              "You don't have access here, try to log in again"
            );
          } else if (response.status === 503) {
            this.props?.onError("Error connecting to database");
          }
        })
        .catch(() => {
          this.props?.onError("Error when connecting to the API");
        });
    }
  }

  updateClan = (e) => {
    e.preventDefault();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/clans`,
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
      params: {
        clanname: this.state.addClanNameInput,
        clancolor: this.state.addClanColorInput,
        clandiscord: this.state.addClanDiscordInput,
        symbol: this.state.clanFlagSymbolInput,
        region: this.state.regionInput,
        recruit: this.state.recruitInput,
      },
    };
    if (this.props?.clanid) {
      options.method = "put";
      options.url = `${process.env.REACT_APP_API_URL}/clans/${this.props?.clanid}`;
    }

    Axios.request(options)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          this.props?.onClose();
        } else if (response.status === 401) {
          this.props?.onClose();
          closeSession();
          this.props?.onError(
            "You don't have access here, try to log in again"
          );
        } else if (response.status === 503 || response.status === 205) {
          this.props?.onError("Error connecting to database");
        }
      })
      .catch(() => {
        this.props?.onClose();
        this.props?.onError("Error when connecting to the API");
      });
  };

  symbolsList() {
    const symbols = [];
    for (let i = 1; i < 31; i++) {
      symbols.push(`C${i}`);
    }
    return symbols.map((symbol) => (
      <button
        type="button"
        className="col-3"
        key={`symbol-${symbol}`}
        onClick={() => this.setState({ clanFlagSymbolInput: symbol })}
      >
        <img
          src={`${process.env.REACT_APP_RESOURCES_URL}/symbols/${symbol}.png`}
          className={
            symbol === this.state.clanFlagSymbolInput
              ? "img-fluid img-thumbnail"
              : "img-fluid"
          }
          alt={symbol}
          id={`symbol-img-${symbol}`}
        />
      </button>
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
                onClick={() => this.props?.onClose()}
              >
                <span aria-hidden="true">X</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.updateClan} id="clanconfig">
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
                  <label htmlFor="regionInput">{t("Region")}</label>
                  <ClusterList
                    onError={(error) => this.setState({ error: error })}
                    value={this.state.regionInput}
                    onChange={(value) =>
                      this.setState({
                        regionInput: value,
                      })
                    }
                    filter={false}
                  />
                </div>
                <div className="form-group">
                  <div className="custom-control custom-switch my-1">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="recruitmentInput"
                      checked={this.state.recruitInput}
                      onChange={() => {
                        this.setState((state) => ({
                          recruitInput: !state.recruitInput,
                        }));
                      }}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="recruitmentInput"
                    >
                      {t("Looking for new members?")}{" "}
                      {t(
                        "By disabling this option the clan does not appear in the clan list."
                      )}
                    </label>
                  </div>
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
                  <label htmlFor="flag_color">
                    {t("Flag Color")} {t("(Optional)")}
                  </label>
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
                  <label htmlFor="sigilClanFlagInput">
                    {t("Symbol")} {t("(Optional)")}
                  </label>
                  <div className="col-12">
                    <div className="row">{this.symbolsList()}</div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.props?.onClose()}
              >
                {t("Close")}
              </button>
              <button
                className="btn btn-primary"
                form="clanconfig"
                type="submit"
                value="Submit"
              >
                {this.props?.clanid ? t("Save") : t("Create a clan")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ClanConfig);
