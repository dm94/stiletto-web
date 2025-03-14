import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getMarkers, getStoredItem } from "../../functions/services";
import ModalMessage from "../ModalMessage";
import MapLayer from "./MapLayer";
import ResourcesInMapList from "./ResourcesInMapList";
import CreateResourceTab from "./CreateResourceTab";
import "../../css/map-sidebar.min.css";
import {
  createResource,
  deleteResource,
  editMap,
  updateResourceTime,
  getResources,
} from "../../functions/requests/maps";

const ResourceMap = ({ map, onReturn }) => {
  const { t } = useTranslation();
  const [userDiscordId] = useState(getStoredItem("discordid"));
  const [token] = useState(getStoredItem("token"));
  const [coordinateXInput, setCoordinateXInput] = useState(0);
  const [coordinateYInput, setCoordinateYInput] = useState(0);
  const [items, setItems] = useState(null);
  const [resourcesInTheMap, setResourcesInTheMap] = useState(null);
  const [pass, setPass] = useState(map?.pass);
  const [textSuccess, setTextSuccess] = useState(null);
  const [center, setCenter] = useState(null);
  const [mapName, setMapName] = useState(map?.name);
  const [dateOfBurning, setDateOfBurning] = useState(map?.dateofburning);
  const [allowEditing, setAllowEditing] = useState(map?.allowedit);
  const [resourcesFiltered, setResourcesFiltered] = useState(null);
  const [isOpenSidebar, setIsOpenSidebar] = useState(window.innerWidth >= 1440);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('resources');

  const fetchData = useCallback(async () => {
    try {
      const markers = await getMarkers();
      setItems(markers);

      const responseResources = await getResources(map.mapid, map.pass);
      if (responseResources.ok) {
        const resources = await responseResources.json();
        setResourcesInTheMap(resources);
      }
    } catch {
      setError("Failed to fetch data");
    }
  }, [map.mapid, map.pass]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateResource = async (
    resourceTypeInput,
    qualityInput,
    descriptionInput,
    lastHarvested
  ) => {
    try {
      const response = await createResource({
        mapid: map?.mapid,
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
      setError("Error when connecting to the API");
    }
  };

  const handleChangeDataMap = async (event) => {
    event.preventDefault();

    try {
      const response = await editMap(
        map.mapid,
        mapName,
        dateOfBurning,
        allowEditing,
        pass
      );
      setTextSuccess(response);
    } catch {
      setError("Error when connecting to the API");
    }
  };

  const handleDeleteResource = async (resourceId, resourceToken) => {
    try {
      const response = await deleteResource(
        map?.mapid,
        resourceId,
        resourceToken
      );
      if (response.success) {
        fetchData();
      } else {
        setError(response.message);
      }
    } catch {
      setError("Error when connecting to the API");
    }
  };

  const handleFilterResources = (resourceType) => {
    if (resourceType === "All") {
      setResourcesFiltered(null);
    } else {
      setResourcesFiltered(
        resourcesInTheMap.filter(
          (resource) => resource.resourcetype === resourceType
        )
      );
    }
  };

  const renderEditMapTab = () => {
    if (userDiscordId === map.discordid) {
      return (
        <div className="p-4">
          <form onSubmit={handleChangeDataMap}>
            <div className="mb-4">
              <label htmlFor="mapname" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Map Name")}
              </label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="mapname"
                value={mapName}
                maxLength="30"
                onChange={(e) => setMapName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="mapdate" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Date of burning")}
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
              <p className="text-gray-300 mb-2">{t("Enable editing with the link")}</p>
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
                  {t("Allow Editing")}
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
                  {t("Read Only")}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Password")}
              </label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                value={pass}
                maxLength="20"
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {t("Update Data")}
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
          text: "Login with discord",
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
          redirectPage: null,
        }}
        onClickOk={() => setTextSuccess(null)}
      />
    );
  }

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <MapLayer
          map={map}
          items={items}
          resourcesInTheMap={resourcesFiltered || resourcesInTheMap}
          onDeleteResource={handleDeleteResource}
          center={center}
          setCenter={setCenter}
          updateResource={(mapid, resourceid, token, date) => {
            try {
              updateResourceTime(mapid, resourceid, token, date);
              fetchData();
            } catch {
              setError("Error when connecting to the API");
            }
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => setIsOpenSidebar(!isOpenSidebar)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <i className={`fas ${isOpenSidebar ? 'fa-times' : 'fa-bars'}`} />
      </button>
      <div
        className={`fixed lg:relative inset-y-0 right-0 z-40 w-full lg:w-1/4 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpenSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
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
                activeTab === 'resources'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('resources')}
            >
              {t("Resources")}
            </button>
            <button
              type="button"
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'create'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('create')}
            >
              {t("Create")}
            </button>
            {userDiscordId === map?.discordid && (
              <button
                type="button"
                className={`flex-1 p-3 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                {t("Settings")}
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'resources' && (
              <ResourcesInMapList
                resourcesInTheMap={resourcesFiltered || resourcesInTheMap}
                onDeleteResource={handleDeleteResource}
                onFilterResources={handleFilterResources}
              />
            )}
            {activeTab === 'create' && (
              <CreateResourceTab
                coordinateXInput={coordinateXInput}
                coordinateYInput={coordinateYInput}
                onCreateResource={handleCreateResource}
                onChangeX={setCoordinateXInput}
                onChangeY={setCoordinateYInput}
              />
            )}
            {activeTab === 'settings' && renderEditMapTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceMap;
