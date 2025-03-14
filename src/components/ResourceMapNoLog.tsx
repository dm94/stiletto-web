"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getMarkers } from "@/lib/services";
import { config } from "@/config/config";
import type { Marker } from "@/types/Marker";
import type { Resource } from "@/types/Resource";
import LoadingScreen from "./LoadingScreen";
import ModalMessage from "./ModalMessage";
import MapLayer from "./MapLayer";
import ResourcesInMapList from "./ResourcesInMapList";
import CreateResourceTab from "./CreateResourceTab";

interface ResourceMapNoLogProps {
  mapId: string;
  pass: string;
}

interface MapData {
  name: string;
  allowedit: boolean;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: MapData;
}

export default function ResourceMapNoLog({
  mapId,
  pass,
}: ResourceMapNoLogProps) {
  const t = useTranslations();
  const [resourcesInTheMap, setResourcesInTheMap] = useState<Resource[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [items, setItems] = useState<Marker[]>([]);
  const [coordinateXInput, setCoordinateXInput] = useState(0);
  const [coordinateYInput, setCoordinateYInput] = useState(0);
  const [resourcesFiltered, setResourcesFiltered] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const markers = await getMarkers();
      setItems(markers);

      const responseResources = await fetch(
        `${config.API_URL}/maps/${mapId}/resources?pass=${pass}`
      );
      if (responseResources.ok) {
        const resources = await responseResources.json();
        setResourcesInTheMap(resources);
      }

      const response = await fetch(
        `${config.API_URL}/maps/${mapId}?pass=${pass}`
      );
      const data: ApiResponse = await response.json();
      if (data.success && data.data) {
        setMapData(data.data);
      } else {
        setError(data.message || "Error fetching map data");
      }
    } catch {
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
        const response = await fetch(
          `${config.API_URL}/maps/${mapId}/resources/${resourceId}?token=${resourceToken}`,
          {
            method: "DELETE",
          }
        );

        const data: ApiResponse = await response.json();
        if (data.success) {
          await fetchData();
        } else {
          setError(data.message || "Error deleting resource");
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
        const response = await fetch(
          `${config.API_URL}/maps/${mapId}/resources`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              x: coordinateXInput,
              y: coordinateYInput,
              mappass: pass,
              resourcetype: resourceTypeInput,
              quality: qualityInput,
              description: descriptionInput,
              harvested: lastHarvested,
            }),
          }
        );

        const data: ApiResponse = await response.json();
        if (data.success) {
          await fetchData();
        } else {
          setError(data.message || "Error creating resource");
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
        setResourcesFiltered([]);
      } else {
        setResourcesFiltered(
          resourcesInTheMap.filter(
            (resource) => resource.resourcetype === resourceType
          )
        );
      }
    },
    [resourcesInTheMap]
  );

  if (!isLoaded) {
    return <LoadingScreen />;
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
    <div className="row flex-xl-nowrap">
      <div
        id="map-sidebar"
        className={`position-absolute bg-secondary p-1 ${
          isOpenSidebar ? "open" : ""
        }`}
      >
        <button
          type="button"
          id="toggle-sidebar-button"
          className="btn btn-info ml-2 mb-2 float-right"
          onClick={() => setIsOpenSidebar((prev) => !prev)}
        >
          <i
            className={
              isOpenSidebar ? "fas fa-chevron-left" : "fas fa-chevron-right"
            }
          />
        </button>
        <nav className="collapse show" id="items-nav" aria-label="Items Navs">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <a
                className="nav-link active"
                id="resource-list-tab"
                data-toggle="tab"
                href="#resourcelist"
                role="tab"
                aria-controls="resourcelist"
                aria-selected="false"
              >
                {t("List")}
              </a>
            </li>
            {mapData?.allowedit && (
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="add-resource-tab"
                  data-toggle="tab"
                  href="#addresource"
                  role="tab"
                  aria-controls="addresource"
                  aria-selected="true"
                >
                  {t("Create resource")}
                </a>
              </li>
            )}
          </ul>
          <div className="tab-content border border-primary">
            <div
              className="tab-pane fade show active"
              id="resourcelist"
              role="tabpanel"
              aria-labelledby="resource-list-tab"
            >
              <ul
                className="list-group overflow-auto w-100"
                style={{ height: "60vh" }}
              >
                <ResourcesInMapList
                  resources={resourcesInTheMap}
                  onDelete={handleDeleteResource}
                  onFilter={handleFilterResources}
                />
              </ul>
            </div>
            <div
              className="tab-pane fade"
              id="addresource"
              role="tabpanel"
              aria-labelledby="add-resource-tab"
            >
              <CreateResourceTab
                items={items}
                coordinateX={coordinateXInput}
                coordinateY={coordinateYInput}
                onCreateResource={handleCreateResource}
              />
            </div>
          </div>
        </nav>
      </div>
      <div className="col-12">
        <div className="col-xl-12 text-center">
          <h1>{mapData?.name || ""}</h1>
        </div>
        <MapLayer
          map={{
            mapid: mapId,
            name: mapData?.name || "",
            dateofburning: new Date().toISOString().split("T")[0],
            allowedit: mapData?.allowedit || false,
            pass,
          }}
          resources={
            resourcesFiltered.length > 0 ? resourcesFiltered : resourcesInTheMap
          }
          onSetCoordinates={(x: number, y: number) => {
            setCoordinateXInput(x);
            setCoordinateYInput(y);
          }}
          center={center}
        />
      </div>
    </div>
  );
}
