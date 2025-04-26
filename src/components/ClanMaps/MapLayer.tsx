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
import { config } from "@config/config";
import type { ResourceInfo } from "@ctypes/dto/resources";
import ResourcePopup from "./ResourcePopup";

interface MapLayerProps {
  resourcesInTheMap: ResourceInfo[];
  deleteResource?: (resourceId: number, resourceToken: string) => void;
  center?: [number, number];
  mapType?: string;
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
  mapType,
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

  const getMarketDesign = useCallback((resource: string) => {
    const res = resource.replaceAll(" ", "_");
    return L.icon({
      iconUrl: `${config.RESOURCES_URL}/markers/${res}.png`,
      iconSize: [25, 41],
      iconAnchor: [13, 44],
      popupAnchor: [-6, -20],
    });
  }, []);

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
            <ResourcePopup
              resource={resource}
              poachingHutRadius={poachingHutRadius}
              updateResource={updateResource}
              deleteResource={deleteResource}
              setPoachingHutRadius={setPoachingHutRadius}
            />
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
    poachingHutRadius,
    updateResource,
    deleteResource,
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
            mapType ?? resourcesInTheMap?.[0]?.typemap ?? "Crater_new"
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
