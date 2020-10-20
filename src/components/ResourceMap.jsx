import React, { Component, Fragment } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import RasterCoords from "leaflet-rastercoords";
import ModalMessage from "./ModalMessage";
import "leaflet/dist/leaflet.css";
const axios = require("axios");

var myMarker = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/marker.png",
  iconSize: [25, 41],
  iconAnchor: [13, 44],
  popupAnchor: [-6, -20],
});

class MapExtended extends Map {
  createLeafletElement(props) {
    let leafletMapElement = super.createLeafletElement(props);
    let img = [6020, 6020];

    let rc = new RasterCoords(leafletMapElement, img);

    leafletMapElement.setView(rc.unproject([img[0], img[1]]), 2);

    return leafletMapElement;
  }
}

class ResourceMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      mapType: this.props.value,
      resourceTypeInput: "Aloe",
      qualityInput: 0,
      coordinateXInput: 0,
      coordinateYInput: 0,
      items: null,
      resourcesInTheMap: null,
      latlng: null,
      hasLocation: false,
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://raw.githubusercontent.com/Last-Oasis-Crafter/lastoasis-crafting-calculator/master/src/items.json"
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
        this.setState({ error: "Try again later" });
      });
  };

  handleClick = (e) => {
    this.setState({
      hasLocation: true,
      coordinateXInput: Math.floor(e.latlng.lat),
      coordinateYInput: Math.floor(e.latlng.lng),
    });
  };

  resourcesList() {
    if (this.state.items != null) {
      return this.state.items.map((item) => (
        <option key={item.name} value={item.name}>
          {item.name}
        </option>
      ));
    }
  }

  getMarkers() {
    if (this.state.resourcesInTheMap != null) {
      return this.state.resourcesInTheMap.map((resource) => (
        <Marker
          key={"resource" + resource.resourceid}
          position={[resource.x, resource.y]}
          icon={myMarker}
        >
          <Popup>
            <p>
              {resource.resourcetype} - Q: {resource.quality}
            </p>
            <small className="text-muted">
              [{Math.floor(resource.x) + "," + Math.floor(resource.y)}]
            </small>
          </Popup>
          <Tooltip>
            {resource.resourcetype} - Q: {resource.quality}
          </Tooltip>
        </Marker>
      ));
    }
    return null;
  }

  render() {
    let position = [this.state.coordinateXInput, this.state.coordinateYInput];
    const marker = this.state.hasLocation ? (
      <Marker position={position} icon={myMarker}>
        <Popup>
          [
          {Math.floor(this.state.coordinateXInput) +
            "," +
            Math.floor(this.state.coordinateYInput)}
          ]
        </Popup>
        <Tooltip>TEST</Tooltip>
      </Marker>
    ) : null;

    if (this.state.user_discord_id == null || this.state.token == null) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: "You have to be connected and have a clan to enter here",
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
              Back to the list of maps
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
                <title>Menu</title>
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
                    <label htmlFor="resourcetype">Type</label>
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
                      {this.resourcesList()}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="coordinateXInput">
                      Coordinate X (Not the real thing)
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
                      Coordinate Y (Not the real thing)
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
                      Quality {this.state.qualityInput}
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
                    Create resource
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </div>
        <div id="map" className="col-xl-9 col-sm-12">
          <MapExtended
            minZoom={0}
            maxZoom={5}
            style={{ width: "800px", height: "800px" }}
            onClick={this.handleClick}
          >
            <TileLayer
              url={
                process.env.REACT_APP_MAPS_URL +
                this.state.mapType +
                "/{z}/{x}/{y}.png"
              }
              noWrap={true}
            />
            {marker}
            <Fragment>{this.getMarkers()}</Fragment>
          </MapExtended>
        </div>
      </div>
    );
  }
}

export default ResourceMap;
