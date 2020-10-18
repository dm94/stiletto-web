import React, { Component } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "bootstrap";
L.RasterCoords = require("leaflet-rastercoords");

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

    var minZoom = 0;
    var maxZoom = 5;
    var img = [
      800, // original width of image `karta.jpg`
      800, // original height of image
    ];

    // create the map
    var map = L.map("map", {
      minZoom: minZoom,
      maxZoom: maxZoom,
    });

    // assign map and image dimensions
    var rc = new L.RasterCoords(map, img);

    // set the view on a marker ...
    map.setView(rc.unproject([img[0], img[1]]), 2);

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
        <option value={item.name}>{item.name}</option>
      ));
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-xl-3">
          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={() => this.props.onReturn()}
          >
            Back to the list of maps
          </button>
          <div className="card border-secondary mb-3">
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
                  Create resoruce (Don´t work)
                </button>
              </form>
            </div>
          </div>
        </div>
        <div id="map" className="col-xl-9"></div>
      </div>
    );
  }
}

export default ResourceMap;
