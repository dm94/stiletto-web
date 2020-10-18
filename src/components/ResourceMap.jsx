import React, { Component } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
L.RasterCoords = require("leaflet-rastercoords");

let map = null;
let rc = null;
var myIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/marker.png",
  iconSize: [25, 41],
  iconAnchor: [20, 35],
  popupAnchor: [-6, -20],
});
var offset = -3010;

function makeMap() {
  var img = [6020, 6020];

  map = L.map("map", {
    minZoom: 0,
    maxZoom: 5,
  });

  rc = new L.RasterCoords(map, img);
  map.setView(rc.unproject([img[0], img[1]]), 2);

  L.control
    .layers(
      {},
      {
        Markers: layerBounds(map, rc),
      }
    )
    .addTo(map);
}

function layerBounds(map, rc) {
  var layerBounds = L.layerGroup([
    L.marker(rc.unproject([-2731 - offset, -481 - offset]), {
      icon: myIcon,
    }).bindPopup("[TEST]"),
  ]);
  map.addLayer(layerBounds);

  map.on("click", function (event) {
    var coord = rc.project(event.latlng);
    var marker = L.marker(rc.unproject(coord), { icon: myIcon }).addTo(
      layerBounds
    );
    marker
      .bindPopup(
        "[" +
          Math.floor(coord.x + offset) +
          "," +
          Math.floor(coord.y + offset) +
          "]"
      )
      .openPopup();
  });

  return layerBounds;
}

class ResourceMap extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      mapType: this.props.value,
      resourcetypeInput: "Aloe",
      qualityInput: 0,
      coordinateXInput: 0,
      coordinateYInput: 0,
      items: null,
      resourcesInTheMap: null,
    };
  }

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/Last-Oasis-Crafter/lastoasis-crafting-calculator/master/src/items.json"
    )
      .then((response) => response.json())
      .then((items) => this.setState({ items }));

    makeMap();
    L.tileLayer(
      process.env.REACT_APP_MAPS_URL + this.state.mapType + "/{z}/{x}/{y}.png",
      {
        noWrap: true,
      }
    ).addTo(map);
  }

  resourcesList() {
    if (this.state.items != null) {
      return this.state.items.map((item) => (
        <option key={item.name} value={item.name}>
          {item.name}
        </option>
      ));
    }
  }

  render() {
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
                <form>
                  <div className="form-group">
                    <label htmlFor="resourcetype">Type</label>
                    <select
                      id="resourcetype"
                      className="custom-select"
                      value={this.state.resourcetypeInput}
                      onChange={(evt) =>
                        this.setState({
                          resourcetypeInput: evt.target.value,
                        })
                      }
                    >
                      {this.resourcesList()}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="coordinateXInput">Coordinate X</label>
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
                    <label htmlFor="coordinateYInput">Coordinate Y</label>
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
                    Create resource (Don´t work)
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </div>
        <div
          id="map"
          className="col-xl-9 col-sm-12"
          style={{ height: 800 }}
        ></div>
      </div>
    );
  }
}

export default ResourceMap;
