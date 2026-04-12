import React, { useReducer, useCallback, useMemo, memo } from "react";
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

type MapClickHandlerProps = {
  onMapClick: (lat: number, lng: number) => void;
};

interface MapLayerState {
  coordinateXInput: number;
  coordinateYInput: number;
  hasLocation: boolean;
  gridOpacity: number;
  poachingHutRadius: number;
}

enum MapLayerActionType {
  SetCoordinates = "SET_COORDINATES",
  SetGridOpacity = "SET_GRID_OPACITY",
  SetPoachingHutRadius = "SET_POACHING_HUT_RADIUS",
}

type MapLayerAction =
  | {
      type: MapLayerActionType.SetCoordinates;
      payload: {
        coordinateXInput: number;
        coordinateYInput: number;
        hasLocation: boolean;
      };
    }
  | {
      type: MapLayerActionType.SetGridOpacity;
      payload: number;
    }
  | {
      type: MapLayerActionType.SetPoachingHutRadius;
      payload: number;
    };

const initialMapLayerState: MapLayerState = {
  coordinateXInput: 0,
  coordinateYInput: 0,
  hasLocation: false,
  gridOpacity: 0,
  poachingHutRadius: 150,
};

const mapLayerReducer = (
  state: MapLayerState,
  action: MapLayerAction,
): MapLayerState => {
  switch (action.type) {
    case MapLayerActionType.SetCoordinates: {
      return {
        ...state,
        coordinateXInput: action.payload.coordinateXInput,
        coordinateYInput: action.payload.coordinateYInput,
        hasLocation: action.payload.hasLocation,
      };
    }
    case MapLayerActionType.SetGridOpacity: {
      return {
        ...state,
        gridOpacity: action.payload,
      };
    }
    case MapLayerActionType.SetPoachingHutRadius: {
      return {
        ...state,
        poachingHutRadius: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const roundedLat = Math.round(e.latlng.lat * 100) / 100;
      const roundedLng = Math.round(e.latlng.lng * 100) / 100;
      onMapClick(roundedLat, roundedLng);
    },
  });

  return null;
};

const MapLayer: React.FC<MapLayerProps> = ({
  resourcesInTheMap,
  center,
  mapType,
  updateResource,
  deleteResource,
  changeInput,
}) => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(mapLayerReducer, initialMapLayerState);
  const {
    coordinateXInput,
    coordinateYInput,
    hasLocation,
    gridOpacity,
    poachingHutRadius,
  } = state;

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
              setPoachingHutRadius={(radius: number) => {
                dispatch({
                  type: MapLayerActionType.SetPoachingHutRadius,
                  payload: radius,
                });
              }}
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

  const handleMapClick = useCallback(
    (roundedLat: number, roundedLng: number) => {
      dispatch({
        type: MapLayerActionType.SetCoordinates,
        payload: {
          coordinateXInput: roundedLat,
          coordinateYInput: roundedLng,
          hasLocation: true,
        },
      });
      changeInput?.(roundedLat, roundedLng);
    },
    [changeInput],
  );

  const handleShowGrid = useCallback(() => {
    dispatch({
      type: MapLayerActionType.SetGridOpacity,
      payload: 1,
    });
  }, []);

  const handleHideGrid = useCallback(() => {
    dispatch({
      type: MapLayerActionType.SetGridOpacity,
      payload: 0,
    });
  }, []);

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
        <MapClickHandler onMapClick={handleMapClick} />
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
