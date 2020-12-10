import React, { Component, Fragment } from "react";
import L from "leaflet";
import { TileLayer, Marker, Popup, Tooltip, ImageOverlay } from "react-leaflet";
import MapExtended from "./MapExtended";
import "leaflet/dist/leaflet.css";
import { withTranslation } from "react-i18next";

var myMarker = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/marker.png",
  iconSize: [25, 41],
  iconAnchor: [13, 44],
  popupAnchor: [-6, -20],
});

class MapLayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinateXInput: 0,
      coordinateYInput: 0,
      hasLocation: false,
      gridOpacity: 1,
    };
  }

  getMarketDesign(resource) {
    var res = resource.replace(" ", "_");
    var marker = null;
    var img = new Image();
    img.src = "https://api2.comunidadgzone.es/markers/" + res + ".png";
    if (img.complete) {
      marker = L.icon({
        iconUrl: "https://api2.comunidadgzone.es/markers/" + res + ".png",
        iconSize: [25, 41],
        iconAnchor: [13, 44],
        popupAnchor: [-6, -20],
      });
    } else {
      marker = myMarker;
    }
    return marker;
  }

  getMarkers(t) {
    if (
      this.props.resourcesInTheMap != null &&
      this.props.resourcesInTheMap[0] != null &&
      this.props.resourcesInTheMap[0].resourceid != null
    ) {
      return this.props.resourcesInTheMap.map((resource) => (
        <Marker
          key={"resource" + resource.resourceid}
          position={[resource.x, resource.y]}
          icon={this.getMarketDesign(resource.resourcetype)}
        >
          <Popup>
            <div className="mb-0">
              {t(resource.resourcetype)} - Q: {resource.quality}
            </div>
            <div className="mb-1 text-muted">
              [{Math.floor(resource.x) + "," + Math.floor(resource.y)}]
            </div>
            <button
              className="btn btn-danger"
              onClick={() => this.props.deleteResource(resource.resourceid)}
            >
              {t("Delete")}
            </button>
          </Popup>
          <Tooltip>
            {t(resource.resourcetype)} - Q: {resource.quality}
          </Tooltip>
        </Marker>
      ));
    }
    return null;
  }

  handleClick = (e) => {
    this.setState({
      hasLocation: true,
      coordinateXInput: Math.round(e.latlng.lat * 100) / 100,
      coordinateYInput: Math.round(e.latlng.lng * 100) / 100,
    });
    this.props.changeInput(
      this.state.coordinateXInput,
      this.state.coordinateYInput
    );
  };

  render() {
    const { t } = this.props;
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
        <Tooltip>{t("Temporal Marker")}</Tooltip>
      </Marker>
    ) : null;

    return (
      <div id="map">
        <MapExtended
          minZoom={0}
          maxZoom={5}
          style={{ width: "100%", height: "800px" }}
          onClick={this.handleClick}
          center={this.props.center}
        >
          <ImageOverlay
            bounds={[
              [85.5, -180],
              [-70.5, 101],
            ]}
            opacity={this.state.gridOpacity}
            url={process.env.REACT_APP_MAPS_URL + "Grid.png"}
          />
          <TileLayer
            url={
              process.env.REACT_APP_MAPS_URL +
              (this.props.resourcesInTheMap != null &&
              this.props.resourcesInTheMap[0] != null &&
              this.props.resourcesInTheMap[0].typemap != null
                ? this.props.resourcesInTheMap[0].typemap
                : "Crater") +
              "/{z}/{x}/{y}.png"
            }
            noWrap={true}
          />
          {marker}
          <Fragment>{this.getMarkers(t)}</Fragment>
        </MapExtended>
      </div>
    );
  }
}

export default withTranslation()(MapLayer);
