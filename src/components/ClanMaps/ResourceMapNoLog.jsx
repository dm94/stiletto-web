import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import { getMarkers } from "../../functions/services";
import LoadingScreen from "../LoadingScreen";
import ModalMessage from "../ModalMessage";
import MapLayer from "./MapLayer";
import ResourcesInMapList from "./ResourcesInMapList";
import CreateResourceTab from "./CreateResourceTab";
import "../../css/map-sidebar.css";
import {
  createResource,
  deleteResource,
  getMap,
  updateResourceTime,
  getResources,
} from "../../functions/requests/maps";

const ResourceMapNoLog = (props) => {
  const { t } = useTranslation();
  const [resourcesInTheMap, setResourcesInTheMap] = useState(null);
  const [mapId, setMapId] = useState(null);
  const [pass, setPass] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [textMessage, setTextMessage] = useState(null);
  const [center, setCenter] = useState(null);
  const [items, setItems] = useState(null);
  const [coordinateXInput, setCoordinateXInput] = useState(0);
  const [coordinateYInput, setCoordinateYInput] = useState(0);
  const [resourcesFiltered, setResourcesFiltered] = useState(null);
  const [error, setError] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("resources");

  const fetchData = useCallback(async () => {
    let parsed = null;
    if (props?.location?.search) {
      parsed = queryString.parse(props.location.search);
    }

    if (
      (props?.mapId || props?.match?.params?.id) &&
      (props?.pass || parsed?.pass)
    ) {
      try {
        const markers = await getMarkers();
        setItems(markers);

        const currentMapId = props?.mapId || props?.match?.params?.id;
        const currentPass = props?.pass || parsed?.pass;

        setMapId(currentMapId);
        setPass(currentPass);

        const responseResources = await getResources(currentMapId, currentPass);
        if (responseResources.ok) {
          const resources = await responseResources.json();
          setResourcesInTheMap(resources);
        }

        const response = await getMap(currentMapId, currentPass);
        if (response.success) {
          setMapData(response.data);
        } else {
          setError(response.message);
        }
      } catch {
        setError("errors.apiConnection");
      }
    } else {
      setError("Unauthorized");
    }
    setIsLoaded(true);
  }, [props]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteResource = useCallback(
    async (resourceId, resourceToken) => {
      try {
        const response = await deleteResource(mapId, resourceId, resourceToken);
        if (response.success) {
          fetchData();
        } else {
          setError(response.message);
        }
      } catch {
        setError("errors.apiConnection");
      }
    },
    [mapId, fetchData],
  );

  const handleCreateResource = useCallback(
    async (
      resourceTypeInput,
      qualityInput,
      descriptionInput,
      lastHarvested,
    ) => {
      try {
        const response = await createResource({
          mapid: mapId,
          x: coordinateXInput,
          y: coordinateYInput,
          mappass: pass,
          resourcetype: resourceTypeInput,
          quality: qualityInput,
          description: descriptionInput,
          harvested: lastHarvested,
        });
        if (response.success) {
          fetchData();
        } else {
          setError(response.message);
        }
      } catch {
        setError("errors.apiConnection");
      }
    },
    [mapId, coordinateXInput, coordinateYInput, pass, fetchData],
  );

  const handleFilterResources = useCallback(
    (resourceType) => {
      if (resourceType === "All") {
        setResourcesFiltered(null);
      } else {
        const filtered = resourcesInTheMap?.filter(
          (resource) => resource.resourcetype === resourceType,
        );
        setResourcesFiltered(filtered);
      }
    },
    [resourcesInTheMap],
  );

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (textMessage) {
    return (
      <ModalMessage
        message={{
          isError: false,
          text: textMessage,
          redirectPage: null,
        }}
        onClickOk={() => setTextMessage(null)}
      />
    );
  }

  if (error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/",
        }}
      />
    );
  }

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <MapLayer
          map={mapData}
          items={items}
          resourcesInTheMap={resourcesFiltered || resourcesInTheMap}
          deleteResource={handleDeleteResource}
          center={center}
          setCenter={setCenter}
          updateResource={(mapid, resourceid, token, date) => {
            try {
              updateResourceTime(mapid, resourceid, token, date);
              fetchData();
            } catch {
              setError("errors.apiConnection");
            }
          }}
          changeInput={(x, y) => {
            setCoordinateXInput(x);
            setCoordinateYInput(y);
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => setIsOpenSidebar(!isOpenSidebar)}
        className="lg:hidden absolute top-1 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <i className={`fas ${isOpenSidebar ? "fa-times" : "fa-bars"}`} />
      </button>
      <div
        className={`fixed lg:relative inset-y-0 right-0 z-40 w-full lg:w-1/4 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 ease-in-out z-10 ${isOpenSidebar ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex border-b border-gray-700">
            <button
              type="button"
              className={`flex-1 p-3 text-sm font-medium ${activeTab === "resources"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
                }`}
              onClick={() => setActiveTab("resources")}
            >
              {t("Resources")}
            </button>
            <button
              type="button"
              className={`flex-1 p-3 text-sm font-medium ${activeTab === "create"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
                }`}
              onClick={() => setActiveTab("create")}
            >
              {t("Create")}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeTab === "resources" && (
              <ResourcesInMapList
                resources={resourcesFiltered || resourcesInTheMap}
                onDeleteResource={handleDeleteResource}
                onFilterResources={handleFilterResources}
              />
            )}
            {activeTab === "create" && (
              <CreateResourceTab
                items={items}
                coordinateXInput={coordinateXInput}
                coordinateYInput={coordinateYInput}
                onCreateResource={handleCreateResource}
                onChangeX={setCoordinateXInput}
                onChangeY={setCoordinateYInput}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceMapNoLog;
