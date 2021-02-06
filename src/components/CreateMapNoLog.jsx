import React, { Component } from "react";
import CreateMapPanel from "./CreateMapPanel";
import { withTranslation } from "react-i18next";
import { getStyle } from "../BGDarkSyles";
import Axios from "axios";

class CreateMapNoLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: null,
      error: null,
      mapIdInput: 0,
      mapPassInput: "",
      showShareMap: false,
    };
  }

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/maps.json"
    )
      .then((response) => response.json())
      .then((maps) => this.setState({ maps }));
  }

  createMap = (event, mapNameInput, mapDateInput, mapSelectInput) => {
    event.preventDefault();
    Axios.post(process.env.REACT_APP_API_URL + "/maps", {
      params: {
        discordid: localStorage.getItem("discordid"),
        token: localStorage.getItem("token"),
        mapname: mapNameInput,
        mapdate: mapDateInput,
        maptype: mapSelectInput,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState({
            mapIdInput: response.data.IdMap,
            mapPassInput: response.data.PassMap,
            showShareMap: true,
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  shareMapLink() {
    var http = window.location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);
    return (
      <input
        className="btn btn-success btn-sm btn-block"
        type="text"
        value={
          host +
          (window.location.port ? ":" + window.location.port : "") +
          "/map?mapid=" +
          this.state.mapIdInput +
          "&pass=" +
          this.state.mapPassInput
        }
        disabled
      />
    );
  }
  render() {
    const { t } = this.props;
    let showHideClassName = this.state.showShareMap
      ? "modal d-block"
      : "modal d-none";
    return (
      <div className="row">
        <div className="col-xl-12">
          <div className={getStyle("card border-secondary mb-3")}>
            <div className="card-header">
              {t("Open a map that has already been created")}
            </div>
            <div className="card-body text-succes">
              <div className="row">
                <div className="col-xl-3 form-group">
                  <label htmlFor="map_id">{t("Map ID")}</label>
                  <input
                    type="number"
                    className={getStyle("form-control")}
                    id="map_id"
                    name="map_id"
                    maxLength="4"
                    value={this.state.mapIdInput}
                    onChange={(evt) =>
                      this.setState({
                        mapIdInput: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-xl-9 form-group">
                  <label htmlFor="map_id">{t("Map Pass")}</label>
                  <input
                    type="text"
                    className={getStyle("form-control")}
                    id="map_pass"
                    name="map_pass"
                    maxLength="30"
                    value={this.state.mapPassInput}
                    onChange={(evt) =>
                      this.setState({
                        mapPassInput: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <button
                className="btn btn-lg btn-outline-success btn-block"
                type="button"
                onClick={() =>
                  this.props.onOpen(
                    this.state.mapIdInput,
                    this.state.mapPassInput
                  )
                }
              >
                {t("Open map")}
              </button>
            </div>
          </div>
        </div>
        <CreateMapPanel maps={this.state.maps} onCreateMap={this.createMap} />
        <div className={showHideClassName}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("Map created")}</h5>
              </div>
              <div className="modal-body">{this.shareMapLink()}</div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-success btn-block"
                  onClick={() =>
                    this.props.onOpen(
                      this.state.mapIdInput,
                      this.state.mapPassInput
                    )
                  }
                >
                  {t("Open Map")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(CreateMapNoLog);
