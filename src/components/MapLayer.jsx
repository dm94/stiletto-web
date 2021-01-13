import React, { Component, Fragment } from "react";
import L from "leaflet";
import {
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  ImageOverlay,
  FeatureGroup,
} from "react-leaflet";
import MapExtended from "./MapExtended";
import "leaflet/dist/leaflet.css";
import { withTranslation } from "react-i18next";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

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
    img.src =
      process.env.REACT_APP_API_GENERAL_URL + "/markers/" + res + ".png";
    if (img.complete) {
      marker = L.icon({
        iconUrl:
          process.env.REACT_APP_API_GENERAL_URL + "/markers/" + res + ".png",
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
              {t(resource.resourcetype)}{" "}
              {resource.quality > 0 && "- Q:" + resource.quality}
            </div>
            <div className="mb-1 text-muted">
              [{Math.floor(resource.x) + "," + Math.floor(resource.y)}]
            </div>
            <div className="mb-1">{resource.description}</div>
            <button
              className={
                resource.token != null
                  ? "btn btn-danger"
                  : "btn btn-danger d-none"
              }
              onClick={() =>
                this.props.deleteResource(resource.resourceid, resource.token)
              }
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
        <div className="btn-group">
          <button
            className={
              this.state.gridOpacity === 1
                ? "btn btn-sm btn-secondary active"
                : "btn btn-sm btn-secondary"
            }
            onClick={() => {
              this.setState({ gridOpacity: 1 });
            }}
            type="button"
          >
            {t("Show Grid")}
          </button>
          <button
            className={
              this.state.gridOpacity === 1
                ? "btn btn-sm btn-secondary"
                : "btn btn-sm btn-secondary active"
            }
            onClick={() => {
              this.setState({ gridOpacity: 0 });
            }}
            type="button"
          >
            {t("Hide Grid")}
          </button>
          <div className="border border-warning rounded p-1">
            {t("The data you draw is not saved, only the markers are saved")}
          </div>
        </div>
        <MapExtended
          minZoom={0}
          maxZoom={5}
          style={{ width: "100%", height: "800px" }}
          onClick={this.handleClick}
          center={this.props.center}
          attributionControl={false}
        >
          <FeatureGroup>
            <EditControl
              position="topright"
              onEdited={this._onEditPath}
              onCreated={this._onCreate}
              onDeleted={this._onDeleted}
              draw={{
                marker: false,
              }}
            />
          </FeatureGroup>
          <ImageOverlay
            bounds={[
              [85.5, -180],
              [-70.5, 101],
            ]}
            opacity={this.state.gridOpacity}
            url={process.env.REACT_APP_API_GENERAL_URL + "/maps/Grid.png"}
          />
          <TileLayer
            url={
              process.env.REACT_APP_API_GENERAL_URL +
              "/maps/" +
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
