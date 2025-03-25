import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import { getMarkers } from "../../functions/services";
import LoadingScreen from "../LoadingScreen";
import ModalMessage from "../ModalMessage";
import MapLayer from "./MapLayer";
import ResourcesInMapList from "./ResourcesInMapList";
import CreateResourceTab from "./CreateResourceTab";
import "../../styles/map-sidebar.css";
import { useLocation, useParams } from "react-router";
import type { Marker } from "../../types/dto/marker";
import type { ResourceInfo } from "../../types/dto/resources";
import {
  addResourceMap,
  deleteResource,
  editResource,
  getResources,
} from "../../functions/requests/maps/resources";

interface ResourceMapNoLogProps {
  mapId?: number;
  pass?: string;
}

const ResourceMapNoLog: React.FC<ResourceMapNoLogProps> = (props) => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [resourcesInTheMap, setResourcesInTheMap] = useState<ResourceInfo[]>(
    [],
  );
  const [mapId, setMapId] = useState<number>();
  const [pass, setPass] = useState<string>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [textMessage, setTextMessage] = useState<string>("");
  const [center, setCenter] = useState<[number, number]>();
  const [items, setItems] = useState<Marker[]>([]);
  const [coordinateXInput, setCoordinateXInput] = useState<number>(0);
  const [coordinateYInput, setCoordinateYInput] = useState<number>(0);
  const [resourcesFiltered, setResourcesFiltered] = useState<ResourceInfo[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("resources");

  const fetchData = useCallback(async () => {
    let parsed = null;
    if (location?.search) {
      parsed = queryString.parse(location.search);
    }

    if ((props?.mapId || id) && (props?.pass || parsed?.pass)) {
      try {
        const markers = (await getMarkers()) as Marker[];
        setItems(markers);

        const currentMapId = Number(props?.mapId ?? id);
        const currentPass = String(props?.pass ?? parsed?.pass);

        setMapId(currentMapId);
        setPass(currentPass);

        const responseResources = await getResources(currentMapId, currentPass);
        setResourcesInTheMap(responseResources);
        setResourcesFiltered(responseResources);
      } catch {
        setError("errors.apiConnection");
      }
    } else {
      setError("error.unauthorized");
    }
    setIsLoaded(true);
  }, [props, id, location?.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteResource = useCallback(
    async (resourceId: number, resourceToken: string) => {
      if (!mapId) {
        return;
      }

      try {
        await deleteResource(mapId, resourceId, resourceToken);
        await fetchData();
      } catch {
        setError("errors.apiConnection");
      }
    },
    [mapId, fetchData],
  );

  const handleCreateResource = useCallback(
    async (
      resourceTypeInput: string,
      qualityInput: number,
      descriptionInput: string,
      lastHarvested: string,
    ) => {
      if (!mapId) {
        return;
      }

      try {
        const response = await addResourceMap(mapId, {
          x: coordinateXInput,
          y: coordinateYInput,
          mappass: pass ?? "",
          resourcetype: resourceTypeInput,
          quality: qualityInput,
          description: descriptionInput,
          harvested: lastHarvested,
        });

        if (response) {
          await fetchData();
        }
      } catch {
        setError("errors.apiConnection");
      }
    },
    [mapId, coordinateXInput, coordinateYInput, pass, fetchData],
  );

  const handleFilterResources = useCallback(
    (resourceType: string) => {
      if (resourceType === "All") {
        setResourcesFiltered(resourcesInTheMap ?? []);
      } else {
        const filtered = (resourcesInTheMap ?? [])?.filter(
          (resource) => resource.resourcetype === resourceType,
        );
        setResourcesFiltered(filtered);
      }
    },
    [resourcesInTheMap],
  );

  const handleUpdateResourceTime = async (
    mapid: number,
    resourceid: number,
    token: string,
    date: string,
  ) => {
    try {
      await editResource(mapid, resourceid, {
        token: token,
        harvested: date,
      });
      await fetchData();
    } catch {
      setError("errors.apiConnection");
    }
  };

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (textMessage) {
    return (
      <ModalMessage
        message={{
          isError: false,
          text: textMessage,
        }}
        onClickOk={() => setTextMessage("")}
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
          resourcesInTheMap={resourcesFiltered || resourcesInTheMap}
          deleteResource={handleDeleteResource}
          center={center}
          updateResource={handleUpdateResourceTime}
          changeInput={(x, y) => {
            setCoordinateXInput(x);
            setCoordinateYInput(y);
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => setIsOpenSidebar(!isOpenSidebar)}
        className="lg:hidden fixed top-9 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <i className={`fas ${isOpenSidebar ? "fa-times" : "fa-bars"}`} />
      </button>
      <div
        className={`fixed lg:relative inset-y-0 right-0 z-40 w-full lg:w-1/4 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 ease-in-out z-10 ${
          isOpenSidebar ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex border-b border-gray-700">
            <button
              type="button"
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === "resources"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("resources")}
            >
              {t("Resources")}
            </button>
            <button
              type="button"
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === "create"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("create")}
            >
              {t("Create")}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === "resources" && (
              <ResourcesInMapList
                resources={resourcesInTheMap}
                onSelect={(x, y) => setCenter([x, y])}
                onFilter={handleFilterResources}
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
