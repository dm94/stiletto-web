import React, { Component } from "react";
import ModalMessage from "./ModalMessage";
import MapLayer from "./MapLayer";
import { withTranslation } from "react-i18next";
const axios = require("axios");

class ResourceMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      mapName: this.props.value,
      resourceTypeInput: "Aloe",
      qualityInput: 0,
      coordinateXInput: 0,
      coordinateYInput: 0,
      items: null,
      resourcesInTheMap: null,
      latlng: null,
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/itemsES_min.json"
      )
      .then((response) => {
        const items = response.data.filter((it) => it.category === "materials");
        this.setState({ items });
      });

    axios
      .get(process.env.REACT_APP_API_URL + "/maps.php", {
        params: {
          discordid: localStorage.getItem("discordid"),
          token: localStorage.getItem("token"),
          dataupdate: this.props.map.mapid,
          accion: "getresources",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ resourcesInTheMap: response.data });
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
      });
  }

  createResource = (event) => {
    event.preventDefault();
    axios
      .get(process.env.REACT_APP_API_URL + "/maps.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          accion: "addresourcemap",
          mapid: this.props.map.mapid,
          resourcetype: this.state.resourceTypeInput,
          quality: this.state.qualityInput,
          x: this.state.coordinateXInput,
          y: this.state.coordinateYInput,
        },
      })
      .then((response) => {
        this.setState({
          resourceTypeInput: "Aloe",
          qualityInput: 0,
          coordinateXInput: 0,
          coordinateYInput: 0,
          hasLocation: false,
        });
        if (response.status === 202) {
          this.componentDidMount();
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({ error: "Login again" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  deleteResource = (resourceid) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/maps.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          accion: "deleteresource",
          mapid: this.props.map.mapid,
          dataupdate: resourceid,
        },
      })
      .then((response) => {
        if (response.status === 202) {
          this.componentDidMount();
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({ error: "Login again" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  changeCoords = (x, y) => {
    this.setState({
      coordinateXInput: x,
      coordinateYInput: y,
    });
  };

  resourcesList(t) {
    if (this.state.items != null) {
      return this.state.items.map((item) => (
        <option key={item.name} value={item.name}>
          {t(item.name)}
        </option>
      ));
    }
  }

  render() {
    const { t } = this.props;
    if (this.state.user_discord_id == null || this.state.token == null) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: t("Login with discord"),
            redirectPage: "/profile",
          }}
        />
      );
    }

    return (
      <div className="row flex-xl-nowrap">
        <div className="col-xl-3 col-sm-12">
          <div className="bd-search d-flex align-items-center">
            <button
              className="btn btn-lg btn-primary btn-block"
              onClick={() => this.props.onReturn()}
            >
              {t("Back to the list of maps")}
            </button>
            <button
              className="btn d-md-none p-0 ml-3"
              type="button"
              data-toggle="collapse"
              data-target="#items-nav"
              aria-controls="items-nav"
              aria-expanded="false"
              aria-label="Toggle items"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                role="img"
                focusable="false"
              >
                <title>{t("Menu")}</title>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M4 7h22M4 15h22M4 23h22"
                ></path>
              </svg>
            </button>
          </div>
          <nav className="collapse show" id="items-nav" aria-label="Items Navs">
            <div className="nav card border-secondary mb-3">
              <div className="card-body">
                <form onSubmit={this.createResource}>
                  <div className="form-group">
                    <label htmlFor="resourcetype">{t("Type")}</label>
                    <select
                      id="resourcetype"
                      className="custom-select"
                      value={this.state.resourceTypeInput}
                      onChange={(evt) =>
                        this.setState({
                          resourceTypeInput: evt.target.value,
                        })
                      }
                    >
                      {this.resourcesList(t)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="coordinateXInput">
                      {t("Coordinate")} X {t("Not the same as in the game")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="coordinateXInput"
                      value={this.state.coordinateXInput}
                      onChange={(evt) =>
                        this.setState({
                          coordinateXInput: evt.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="coordinateYInput">
                      {t("Coordinate")} Y {t("Not the same as in the game")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="coordinateYInput"
                      value={this.state.coordinateYInput}
                      onChange={(evt) =>
                        this.setState({
                          coordinateYInput: evt.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quality">
                      {t("Quality:")} {this.state.qualityInput}
                    </label>
                    <input
                      type="range"
                      className="form-control-range"
                      id="quality"
                      value={this.state.qualityInput}
                      max="200"
                      onChange={(evt) =>
                        this.setState({
                          qualityInput: evt.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    className="btn btn-lg btn-outline-success btn-block"
                    type="submit"
                    value="Submit"
                  >
                    {t("Create resource")}
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </div>
        <div className="col-xl-9 col-sm-12">
          <MapLayer
            key={this.props.map.mapid}
            resourcesInTheMap={this.state.resourcesInTheMap}
            deleteResource={this.deleteResource}
            changeInput={this.changeCoords}
            mapName={this.state.mapName}
          ></MapLayer>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ResourceMap);
