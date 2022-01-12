import React, { Component, Fragment } from "react";
import L from "leaflet";
import {
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  ImageOverlay,
  Circle,
} from "react-leaflet";
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
      poachingHutRadius: 150,
    };
  }

  getMarketDesign = (resource) => {
    let res = resource.replaceAll(" ", "_");
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
    let estimatedQuality = (minutes - 45) / 10;

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

    let fullDate = new Date(now.getTime() + remainingQuality * 10 * 60000);

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
          {t("Estimated current Quality")}:{" "}
          {estimatedQuality < 0
            ? t("No respawn yet")
            : Math.floor(estimatedQuality)}
        </div>
        <div className="mb-1">
          {t("Max quality in")}:{" "}
          {remainingQuality !== 0
            ? remainingQuality * 10 + " " + t("Minutes")
            : t("Now")}
        </div>
        <div className="mb-1">
          {t("Date")}: {fullDate.toLocaleString()}
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
        <Fragment key={"marker-" + resource.resourceid}>
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
              {resource.token != null && (
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    this.props.deleteResource(
                      resource.resourceid,
                      resource.token
                    )
                  }
                >
                  {t("Delete")}
                </button>
              )}
              {resource.resourcetype === "Poaching Hut" ||
              resource.resourcetype === "Enemy Poaching Hut" ? (
                <div className="border-top border-warning mt-2">
                  <input
                    className="form-control form-control-sm"
                    id="formPoachingRadius"
                    value={this.state.poachingHutRadius}
                    onChange={(e) =>
                      this.setState({ poachingHutRadius: e.target.value })
                    }
                    type="range"
                    min="0"
                    max="250"
                  ></input>
                </div>
              ) : (
                ""
              )}
            </Popup>
            <Tooltip
              permanent={
                resource.quality && resource.quality > 0 ? true : false
              }
              className="bg-transparent border-0"
              offset={[0, 7]}
              direction="top"
            >
              <span
                className="font-weight-bold h5"
                style={{ color: "#e94e0f" }}
              >
                {resource.quality}
              </span>
            </Tooltip>
          </Marker>
          {resource.resourcetype === "Poaching Hut" ||
          resource.resourcetype === "Enemy Poaching Hut" ? (
            <Circle
              center={[resource.x, resource.y]}
              pathOptions={{ fillColor: "blue" }}
              radius={this.state.poachingHutRadius * 10000}
            />
          ) : (
            ""
          )}
        </Fragment>
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

    let isNewMap =
      this.props.resourcesInTheMap != null &&
      this.props.resourcesInTheMap[0] != null &&
      this.props.resourcesInTheMap[0].typemap != null &&
      this.props.resourcesInTheMap[0].typemap.includes("_new");

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
          maxZoom={6}
          style={{ width: "100%", height: "calc(100vh - 200px)" }}
          onClick={this.handleClick}
          center={this.props.center}
          attributionControl={false}
        >
          <ImageOverlay
            bounds={
              isNewMap
                ? [
                    [85.5, -180],
                    [-84.9, 177.3],
                  ]
                : [
                    [85.5, -180],
                    [-78, 130],
                  ]
            }
            opacity={this.state.gridOpacity}
            url={
              process.env.REACT_APP_API_GENERAL_URL +
              (isNewMap ? "/maps/Grid_new.png" : "/maps/Grid.png")
            }
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
