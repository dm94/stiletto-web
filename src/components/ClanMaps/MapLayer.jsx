import React, { useState } from "react";
import {
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  ImageOverlay,
  Circle,
} from "react-leaflet";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import MapExtended from "./MapExtended";
import "leaflet/dist/leaflet.css";
import Icon from "../Icon";

const myMarker = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/marker.png",
  iconSize: [25, 41],
  iconAnchor: [13, 44],
  popupAnchor: [-6, -20],
});

const MapLayer = ({
  resourcesInTheMap,
  center,
  updateResource,
  deleteResource,
  changeInput,
}) => {
  const { t } = useTranslation();
  const [coordinateXInput, setCoordinateXInput] = useState(0);
  const [coordinateYInput, setCoordinateYInput] = useState(0);
  const [hasLocation, setHasLocation] = useState(false);
  const [gridOpacity, setGridOpacity] = useState(0);
  const [poachingHutRadius, setPoachingHutRadius] = useState(150);

  const getResourceEstimatedQuality = (resource) => {
    const quality = 4;
    const diff = Math.abs(new Date() - new Date(resource.lastharvested));
    const minutes = Math.floor(diff / 1000 / 60);
    const estimatedQuality = (minutes - 45) / 10;
    const remainingQuality = quality - estimatedQuality;

    const now = new Date();
    const date = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
    const fullDate = new Date(now.getTime() + remainingQuality * 10 * 60000);

    return (
      <div>
        <button
          type="button"
          className="btn btn-info btn-sm btn-block"
          onClick={() =>
            updateResource(
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
          {t("Spawns in")}:{" "}
          {remainingQuality !== 0
            ? `${remainingQuality * 10} ${t("Minutes")}`
            : t("Now")}
        </div>
        <div className="mb-1">
          {t("Date")}: {fullDate.toLocaleString()}
        </div>
      </div>
    );
  };

  const getMarketDesign = (resource) => {
    const res = resource.replaceAll(" ", "_");
    return L.icon({
      iconUrl: `${process.env.REACT_APP_RESOURCES_URL}/markers/${res}.png`,
      iconSize: [25, 41],
      iconAnchor: [13, 44],
      popupAnchor: [-6, -20],
    });
  };

  const getMarkers = () => {
    if (resourcesInTheMap?.[0]?.resourceid) {
      return resourcesInTheMap.map((resource) => (
        <React.Fragment key={`marker-${resource.resourceid}`}>
          <Marker
            position={[resource.x, resource.y]}
            icon={getMarketDesign(resource.resourcetype)}
          >
            <Popup>
              <div className="mb-0">
                <Icon name={resource.resourcetype} />
                {t(resource.resourcetype)}
              </div>
              <div className="mb-1 text-muted">
                [{`${Math.floor(resource.x)},${Math.floor(resource.y)}`}]
              </div>
              <div className="mb-1">{resource.description}</div>
              {resource.lastharvested && getResourceEstimatedQuality(resource)}
              {resource.token && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    deleteResource(resource.resourceid, resource.token)
                  }
                >
                  {t("Delete")}
                </button>
              )}
              {(resource.resourcetype === "Poaching Hut" ||
                resource.resourcetype === "Enemy Poaching Hut") && (
                <div className="border-top border-warning mt-2">
                  <input
                    className="form-control form-control-sm"
                    id="formPoachingRadius"
                    value={poachingHutRadius}
                    onChange={(e) => setPoachingHutRadius(e.target.value)}
                    type="range"
                    min="0"
                    max="250"
                  />
                </div>
              )}
            </Popup>
          </Marker>
          {(resource.resourcetype === "Poaching Hut" ||
            resource.resourcetype === "Enemy Poaching Hut") && (
            <Circle
              center={[resource.x, resource.y]}
              pathOptions={{ fillColor: "blue" }}
              radius={poachingHutRadius * 10000}
            />
          )}
        </React.Fragment>
      ));
    }
    return false;
  };

  const handleClick = (e) => {
    setHasLocation(true);
    setCoordinateXInput(Math.round(e.latlng.lat * 100) / 100);
    setCoordinateYInput(Math.round(e.latlng.lng * 100) / 100);
    changeInput(
      Math.round(e.latlng.lat * 100) / 100,
      Math.round(e.latlng.lng * 100) / 100
    );
  };

  const position = [coordinateXInput, coordinateYInput];
  const marker = hasLocation ? (
    <Marker position={position} icon={myMarker}>
      <Popup>
        [{`${Math.floor(coordinateXInput)},${Math.floor(coordinateYInput)}`}]{" "}
        {t("This marker is used for positioning when creating a resource")}
      </Popup>
      <Tooltip>{t("Temporal Marker")}</Tooltip>
    </Marker>
  ) : (
    false
  );

  const isNewMap = resourcesInTheMap?.[0]?.typemap?.includes("_new");

  return (
    <div id="map">
      <div className="btn-group">
        <button
          type="button"
          className={`btn btn-sm btn-secondary ${
            gridOpacity === 1 ? "active" : ""
          }`}
          onClick={() => setGridOpacity(1)}
        >
          {t("Show Grid")}
        </button>
        <button
          type="button"
          className={`btn btn-sm btn-secondary ${
            gridOpacity === 0 ? "active" : ""
          }`}
          onClick={() => setGridOpacity(0)}
        >
          {t("Hide Grid")}
        </button>
      </div>
      <MapExtended
        maxZoom={6}
        style={{ width: "100%", height: "calc(100vh - 200px)" }}
        onClick={handleClick}
        center={center}
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
          opacity={gridOpacity}
          url={`${process.env.REACT_APP_RESOURCES_URL}${
            isNewMap ? "/maps/Grid_new.png" : "/maps/Grid.png"
          }`}
        />
        <TileLayer
          url={`${process.env.REACT_APP_RESOURCES_URL}/maps/${
            resourcesInTheMap?.[0]?.typemap || "Crater"
          }/{z}/{x}/{y}.png`}
          noWrap
        />
        {marker}
        {getMarkers()}
      </MapExtended>
    </div>
  );
};

export default MapLayer;
