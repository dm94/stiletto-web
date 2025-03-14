"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import LoadingScreen from "../LoadingScreen";
import ModalMessage from "../ModalMessage";
import MapLayer from "./MapLayer";
import ResourcesInMapList from "./ResourcesInMapList";
import CreateResourceTab from "./CreateResourceTab";
import { getMarkers } from "@/lib/services";
import {
  createResource,
  deleteResource,
  getMap,
  updateResourceTime,
  getResources,
} from "@/lib/requests/maps";
import type { Resource, MapData, Marker } from "@/types/maps";

interface ResourceMapNoLogProps {
  mapId: string;
  pass: string;
}

export default function ResourceMapNoLog({
  mapId,
  pass,
}: ResourceMapNoLogProps) {
  const t = useTranslations();
  const [resourcesInTheMap, setResourcesInTheMap] = useState<Resource[] | null>(
    null
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [textMessage, setTextMessage] = useState<string | null>(null);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [items, setItems] = useState<Marker[] | null>(null);
  const [coordinateXInput, setCoordinateXInput] = useState(0);
  const [coordinateYInput, setCoordinateYInput] = useState(0);
  const [resourcesFiltered, setResourcesFiltered] = useState<Resource[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const markers = await getMarkers();
      setItems(markers);

      const responseResources = await getResources(mapId, pass);
      if (responseResources.ok) {
        const resources = await responseResources.json();
        setResourcesInTheMap(resources);
      }

      const response = await getMap(mapId, pass);
      if (response.success) {
        setMapData(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Error when connecting to the API");
    }
    setIsLoaded(true);
  }, [mapId, pass]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteResource = useCallback(
    async (resourceId: string, resourceToken: string) => {
      try {
        const response = await deleteResource(mapId, resourceId, resourceToken);
        if (response.success) {
          fetchData();
        } else {
          setError(response.message);
        }
      } catch {
        setError("Error when connecting to the API");
      }
    },
    [mapId, fetchData]
  );

  const handleCreateResource = useCallback(
    async (
      resourceTypeInput: string,
      qualityInput: number,
      descriptionInput: string,
      lastHarvested: string
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
        setError("Error when connecting to the API");
      }
    },
    [mapId, coordinateXInput, coordinateYInput, pass, fetchData]
  );

  const handleFilterResources = useCallback(
    (resourceType: string) => {
      if (resourceType === "All") {
        setResourcesFiltered(null);
      } else {
        const filtered = resourcesInTheMap?.filter(
          (resource) => resource.resourcetype === resourceType
        );
        setResourcesFiltered(filtered);
      }
    },
    [resourcesInTheMap]
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
    <div className="relative flex">
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 p-4 transition-transform duration-300 transform ${
          isOpenSidebar ? "translate-x-0" : "-translate-x-full"
        } z-10`}
      >
        <button
          type="button"
          className="absolute right-0 top-4 -mr-10 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r"
          onClick={() => setIsOpenSidebar((prev) => !prev)}
        >
          <span className="sr-only">{t("Toggle Sidebar")}</span>
          {isOpenSidebar ? (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>

        <div className="h-full flex flex-col">
          <div className="flex mb-4">
            <button
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-l"
              role="tab"
              aria-selected="true"
            >
              {t("List")}
            </button>
            {mapData?.allowedit && (
              <button
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-r"
                role="tab"
                aria-selected="false"
              >
                {t("Create resource")}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <ResourcesInMapList
                resources={resourcesInTheMap}
                onSelect={(x, y) => setCenter([x, y])}
                onFilter={handleFilterResources}
              />
            </div>
          </div>

          {mapData?.allowedit && (
            <div className="mt-4">
              <CreateResourceTab
                items={items}
                onCreateResource={handleCreateResource}
                coordinateXInput={coordinateXInput}
                coordinateYInput={coordinateYInput}
                onChangeX={setCoordinateXInput}
                onChangeY={setCoordinateYInput}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <MapLayer
          resources={resourcesFiltered || resourcesInTheMap}
          center={center}
          onDeleteResource={handleDeleteResource}
          onUpdateResource={updateResourceTime}
          onCoordinateSelect={(x, y) => {
            setCoordinateXInput(x);
            setCoordinateYInput(y);
          }}
        />
      </div>
    </div>
  );
}
