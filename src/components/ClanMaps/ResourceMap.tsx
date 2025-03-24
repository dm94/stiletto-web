import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getMarkers, getStoredItem } from "../../functions/services";
import ModalMessage from "../ModalMessage";
import MapLayer from "./MapLayer";
import ResourcesInMapList from "./ResourcesInMapList";
import CreateResourceTab from "./CreateResourceTab";
import "../../styles/map-sidebar.css";
import type { MapInfo } from "../../types/dto/maps";
import type { Marker } from "../../types/dto/marker";
import {
  addResourceMap,
  deleteResource,
  editResource,
  getResources,
} from "../../functions/requests/maps/resources";
import type { ResourceInfo } from "../../types/dto/resources";
import { editMap } from "../../functions/requests/maps";
import { sendNotification } from "../../functions/broadcast";
import { useNavigate } from "react-router";

interface ResourceMapProps {
  map: MapInfo;
  onReturn: () => void;
}

const ResourceMap: React.FC<ResourceMapProps> = ({ map, onReturn }) => {
  const { t } = useTranslation();
  const [userDiscordId] = useState<string | null>(getStoredItem("discordid"));
  const [token] = useState<string>(getStoredItem("token") ?? "");
  const [coordinateXInput, setCoordinateXInput] = useState<number>(0);
  const [coordinateYInput, setCoordinateYInput] = useState<number>(0);
  const [items, setItems] = useState<Marker[]>([]);
  const [resourcesInTheMap, setResourcesInTheMap] = useState<ResourceInfo[]>(
    [],
  );
  const [pass, setPass] = useState<string>(map?.pass ?? "");
  const [textSuccess, setTextSuccess] = useState<string>();
  const [center, setCenter] = useState<[number, number]>();
  const [mapName, setMapName] = useState<string>(map?.name);
  const [dateOfBurning, setDateOfBurning] = useState<string>(
    map?.dateofburning ?? "",
  );
  const [allowEditing, setAllowEditing] = useState<boolean>(map?.allowedit);
  const [resourcesFiltered, setResourcesFiltered] = useState<ResourceInfo[]>(
    [],
  );
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(
    window.innerWidth >= 1440,
  );
  const [error, setError] = useState<string>();
  const [activeTab, setActiveTab] = useState<string>("resources");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const markers = await getMarkers();
      if (markers) {
        setItems(markers);
      }

      const responseResources = await getResources(map.mapid, map.pass ?? "");
      setResourcesInTheMap(responseResources);
      setResourcesFiltered(responseResources);
    } catch {
      sendNotification("Failed to fetch data", "Error");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }, [map.mapid, map.pass, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateResource = async (
    resourceTypeInput: string,
    qualityInput: number,
    descriptionInput: string,
    lastHarvested: string,
  ) => {
    try {
      await addResourceMap(Number(map?.mapid), {
        x: coordinateXInput,
        y: coordinateYInput,
        mappass: pass ?? "",
        resourcetype: resourceTypeInput,
        quality: qualityInput,
        description: descriptionInput,
        harvested: lastHarvested,
      });

      fetchData();
    } catch {
      setError("errors.apiConnection");
    }
  };

  const handleChangeDataMap = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await editMap(map?.mapid, {
        mapname: mapName,
        mapdate: dateOfBurning,
        allowediting: allowEditing,
        mappass: pass ?? "",
      });
      setTextSuccess(response?.message ?? "");
    } catch {
      setError("errors.apiConnection");
    }
  };

  const handleDeleteResource = async (
    resourceId: number,
    resourceToken: string,
  ) => {
    try {
      await deleteResource(map?.mapid, resourceId, resourceToken);
      fetchData();
    } catch {
      setError("errors.apiConnection");
    }
  };

  const handleUpdateResource = async (
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
      fetchData();
    } catch {
      setError("errors.apiConnection");
    }
  };

  const handleFilterResources = (resourceType: string) => {
    if (resourceType === "All") {
      setResourcesFiltered(resourcesInTheMap);
    } else {
      setResourcesFiltered(
        resourcesInTheMap.filter(
          (resource) => resource.resourcetype === resourceType,
        ),
      );
    }
  };

  const renderEditMapTab = () => {
    if (userDiscordId === map.discordid) {
      return (
        <div className="p-4">
          <form onSubmit={handleChangeDataMap}>
            <div className="mb-4">
              <label
                htmlFor="mapname"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("maps.mapName")}
              </label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="mapname"
                value={mapName}
                maxLength={30}
                onChange={(e) => setMapName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="mapdate"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("maps.dateOfBurning")}
              </label>
              <input
                type="date"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="mapdate"
                value={dateOfBurning}
                onChange={(e) => setDateOfBurning(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                {t("maps.enableEditingWithLink")}
              </p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`flex-1 p-2 rounded-lg ${
                    allowEditing
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setAllowEditing(true)}
                >
                  {t("maps.allowEditing")}
                </button>
                <button
                  type="button"
                  className={`flex-1 p-2 rounded-lg ${
                    !allowEditing
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setAllowEditing(false)}
                >
                  {t("maps.readOnly")}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("common.password")}
              </label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                value={pass}
                maxLength={20}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {t("common.updateData")}
            </button>
          </form>
        </div>
      );
    }
    return false;
  };

  if (!userDiscordId || !token) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: "auth.loginWithDiscord",
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (textSuccess) {
    return (
      <ModalMessage
        message={{
          isError: false,
          text: textSuccess,
        }}
        onClickOk={() => setTextSuccess(undefined)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <MapLayer
          resourcesInTheMap={
            resourcesFiltered.length > 0 ? resourcesFiltered : resourcesInTheMap
          }
          deleteResource={handleDeleteResource}
          center={center}
          updateResource={handleUpdateResource}
          changeInput={(x: number, y: number) => {
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
        className={`fixed lg:relative inset-y-0 right-0 z-40 w-full lg:w-1/4 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 ease-in-out z-10 ${
          isOpenSidebar ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <button
              type="button"
              className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onReturn}
            >
              {t("Return to map list")}
            </button>
          </div>
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
            {userDiscordId === map?.discordid && (
              <button
                type="button"
                className={`flex-1 p-3 text-sm font-medium ${
                  activeTab === "settings"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                {t("Settings")}
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === "resources" && (
              <ResourcesInMapList
                resources={
                  resourcesFiltered.length > 0
                    ? resourcesFiltered
                    : resourcesInTheMap
                }
                onFilter={handleFilterResources}
                onSelect={(x: number, y: number) => setCenter([x, y])}
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
            {activeTab === "settings" && renderEditMapTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceMap;
