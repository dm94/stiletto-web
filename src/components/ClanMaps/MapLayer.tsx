import React, { useState, useCallback, useMemo, memo } from "react";
import {
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  ImageOverlay,
  Circle,
  useMapEvents,
} from "react-leaflet";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import MapExtended from "./MapExtended";
import "leaflet/dist/leaflet.css";
import Icon from "../Icon";
import { config } from "../../config/config";
import type { ResourceInfo } from "../../types/dto/resources";

interface MapLayerProps {
  resourcesInTheMap: ResourceInfo[];
  deleteResource?: (resourceId: number, resourceToken: string) => void;
  center?: [number, number];
  updateResource?: (
    mapId: number,
    resourceId: number,
    token: string,
    date: string,
  ) => void;
  changeInput?: (x: number, y: number) => void;
}

const myMarker = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/marker.png",
  iconSize: [25, 41],
  iconAnchor: [13, 44],
  popupAnchor: [-6, -20],
});

const MapLayer: React.FC<MapLayerProps> = ({
  resourcesInTheMap,
  center,
  updateResource,
  deleteResource,
  changeInput,
}) => {
  const { t } = useTranslation();
  const [coordinateXInput, setCoordinateXInput] = useState<number>(0);
  const [coordinateYInput, setCoordinateYInput] = useState<number>(0);
  const [hasLocation, setHasLocation] = useState<boolean>(false);
  const [gridOpacity, setGridOpacity] = useState<number>(0);
  const [poachingHutRadius, setPoachingHutRadius] = useState<number>(150);

  const getResourceEstimatedQuality = useCallback(
    (resource: ResourceInfo) => {
      const quality = 4;
      const diff = Math.abs(
        new Date().getTime() - new Date(resource.lastharvested ?? "").getTime(),
      );
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
            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            onClick={() =>
              updateResource?.(
                resource.mapid,
                resource.resourceid,
                resource.token ?? "",
                date,
              )
            }
          >
            {t("resources.harvestedNow")}
          </button>
          <div className="mb-1 text-gray-300">
            {t("resources.lastHarvested")}: {resource.lastharvested}
          </div>
          <div className="mb-1 text-gray-300">
            {t("Spawns in")}:{" "}
            {remainingQuality !== 0
              ? `${remainingQuality * 10} ${t("common.minutes")}`
              : t("common.now")}
          </div>
          <div className="mb-1 text-gray-300">
            {t("Date")}: {fullDate.toLocaleString()}
          </div>
        </div>
      );
    },
    [t, updateResource],
  );

  const getMarketDesign = useCallback((resource: string) => {
    const res = resource.replace(" ", "_");
    return L.icon({
      iconUrl: `${config.RESOURCES_URL}/markers/${res}.png`,
      iconSize: [25, 41],
      iconAnchor: [13, 44],
      popupAnchor: [-6, -20],
    });
  }, []);

  const handleDeleteResource = useCallback(
    (resourceId: number, resourceToken: string) => {
      deleteResource?.(resourceId, resourceToken);
    },
    [deleteResource],
  );

  const handlePoachingRadiusChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPoachingHutRadius(Number(e.target.value));
    },
    [],
  );

  const getMarkers = useMemo(() => {
    if (!resourcesInTheMap?.[0]?.resourceid) {
      return null;
    }

    return resourcesInTheMap.map((resource) => (
      <React.Fragment key={`marker-${resource.resourceid}`}>
        <Marker
          position={[resource.x, resource.y]}
          icon={getMarketDesign(resource.resourcetype)}
        >
          <Popup>
            <div className="mb-0 text-gray-300">
              <Icon name={resource.resourcetype} />
              {t(resource.resourcetype)}
            </div>
            <div className="mb-1 text-gray-400">
              [{`${Math.floor(resource.x)},${Math.floor(resource.y)}`}]
            </div>
            <div className="mb-1 text-gray-300">{resource.description}</div>
            {resource.lastharvested && getResourceEstimatedQuality(resource)}
            {resource.token && (
              <button
                type="button"
                className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() =>
                  handleDeleteResource(
                    resource.resourceid,
                    resource?.token ?? "",
                  )
                }
                aria-label={`${t("common.delete")} ${t(resource.resourcetype)} ${t("common.at")} ${Math.floor(resource.x)},${Math.floor(resource.y)}`}
              >
                {t("common.delete")}
              </button>
            )}
            {(resource.resourcetype === "Poaching Hut" ||
              resource.resourcetype === "Enemy Poaching Hut") && (
              <div className="border-t border-yellow-500 mt-2 pt-2">
                <input
                  className="w-full"
                  id="formPoachingRadius"
                  value={poachingHutRadius}
                  onChange={handlePoachingRadiusChange}
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
  }, [
    resourcesInTheMap,
    getMarketDesign,
    getResourceEstimatedQuality,
    handleDeleteResource,
    handlePoachingRadiusChange,
    poachingHutRadius,
    t,
  ]);

  // Map click handler component using useMapEvents hook
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const roundedLat = Math.round(e.latlng.lat * 100) / 100;
        const roundedLng = Math.round(e.latlng.lng * 100) / 100;

        setHasLocation(true);
        setCoordinateXInput(roundedLat);
        setCoordinateYInput(roundedLng);
        changeInput?.(roundedLat, roundedLng);
      },
    });
    return null;
  };

  const handleShowGrid = useCallback(() => setGridOpacity(1), []);
  const handleHideGrid = useCallback(() => setGridOpacity(0), []);

  const position: [number, number] = useMemo(
    () => [coordinateXInput, coordinateYInput],
    [coordinateXInput, coordinateYInput],
  );

  const marker = useMemo(() => {
    if (!hasLocation) {
      return null;
    }

    return (
      <Marker position={position} icon={myMarker}>
        <Popup>
          [{`${Math.floor(coordinateXInput)},${Math.floor(coordinateYInput)}`}]{" "}
          {t("This marker is used for positioning when creating a resource")}
        </Popup>
        <Tooltip>{t("maps.temporalMarker")}</Tooltip>
      </Marker>
    );
  }, [hasLocation, position, coordinateXInput, coordinateYInput, t]);

  return (
    <div id="map">
      <div className="flex space-x-2 mb-4 justify-end">
        <button
          type="button"
          className={`p-2 rounded-lg ${
            gridOpacity === 1
              ? "bg-gray-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={handleShowGrid}
        >
          {t("maps.showGrid")}
        </button>
        <button
          type="button"
          className={`p-2 rounded-lg ${
            gridOpacity === 0
              ? "bg-gray-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={handleHideGrid}
        >
          {t("maps.hideGrid")}
        </button>
      </div>
      <MapExtended
        maxZoom={6}
        style={{ width: "100%", height: "calc(100vh - 200px)" }}
        center={center}
        attributionControl={false}
      >
        <MapClickHandler />
        <ImageOverlay
          bounds={[
            [85.5, -180],
            [-84.9, 177.3],
          ]}
          opacity={gridOpacity}
          url={`${config.RESOURCES_URL}/maps/Grid_new.png`}
        />
        <TileLayer
          url={`${config.RESOURCES_URL}/maps/${
            resourcesInTheMap?.[0]?.typemap ?? "Crater_new"
          }/{z}/{x}/{y}.png`}
          noWrap
        />
        {marker}
        {getMarkers}
      </MapExtended>
    </div>
  );
};

export default memo(MapLayer);
