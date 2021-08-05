import React, { Component, Fragment } from "react";
import L from "leaflet";
import { TileLayer, Marker, Popup, Tooltip, ImageOverlay } from "react-leaflet";
import MapExtended from "./MapExtended";
import "leaflet/dist/leaflet.css";
import { withTranslation } from "react-i18next";
import Icon from "./Icon";

let myMarker = L.icon({
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
      gridOpacity: 0,
    };
  }

  getMarketDesign = (resource) => {
    let res = resource.replace(" ", "_");
    let marker = L.icon({
      iconUrl:
        process.env.REACT_APP_API_GENERAL_URL + "/markers/" + res + ".png",
      iconSize: [25, 41],
      iconAnchor: [13, 44],
      popupAnchor: [-6, -20],
    });

    return marker;
  };

  getResourceEstimatedQuality(t, resource) {
    const diff = Math.abs(new Date() - new Date(resource.lastharvested));
    const minutes = Math.floor(diff / 1000 / 60);
    let estimatedQuality = minutes / 10;

    if (estimatedQuality > resource.quality) {
      estimatedQuality = resource.quality;
    }
    const remainingQuality = resource.quality - estimatedQuality;
    let now = new Date();
    let date =
      now.getFullYear() +
      "-" +
      (now.getMonth() + 1) +
      "-" +
      now.getDate() +
      " " +
      now.getHours() +
      ":" +
      now.getMinutes();
    return (
      <div>
        <button
          className="btn btn-info btn-sm btn-block"
          onClick={() =>
            this.props.updateResource(
              resource.mapid,
              resource.resourceid,
              resource.token,
              date
            )
          }
        >
          {t("Harvested now")}
        </button>
        <div className="mb-1">
          {t("Last Harvested")}: {resource.lastharvested}
        </div>
        <div className="mb-1">
          {t("Estimated current Quality")}: {Math.floor(estimatedQuality)}
        </div>
        <div className="mb-1">
          {t("Max quality in")}:{" "}
          {remainingQuality !== 0
            ? remainingQuality * 10 + " " + t("Minutes")
            : t("Now")}
        </div>
      </div>
    );
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
              <Icon
                key={"icon" + resource.resourceid}
                name={resource.resourcetype}
              />
              {t(resource.resourcetype)}{" "}
              {resource.quality > 0 && "- Q:" + resource.quality}
            </div>
            <div className="mb-1 text-muted">
              [{Math.floor(resource.x) + "," + Math.floor(resource.y)}]
            </div>
            <div className="mb-1">{resource.description}</div>
            {resource.quality > 0 && resource.lastharvested != null
              ? this.getResourceEstimatedQuality(t, resource)
              : ""}
            <button
              className={resource.token != null ? "btn btn-danger" : "d-none"}
              onClick={() =>
                this.props.deleteResource(resource.resourceid, resource.token)
              }
            >
              {t("Delete")}
            </button>
          </Popup>
          <Tooltip
            permanent={resource.quality && resource.quality > 0 ? true : false}
            className="bg-transparent border-0"
            offset={[0, 7]}
            direction="top"
          >
            <span className="font-weight-bold h5" style={{ color: "#e94e0f" }}>
              {resource.quality}
            </span>
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
          ]{t("This marker is used for positioning when creating a resource")}
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
        </div>
        <MapExtended
          minZoom={0}
          maxZoom={5}
          style={{ width: "100%", height: "800px" }}
          onClick={this.handleClick}
          center={this.props.center}
          attributionControl={false}
        >
          <ImageOverlay
            bounds={[
              [85.5, -180],
              [-78, 130],
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
