"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getMarkers, getStoredItem } from "@/lib/services";
import { config } from "@/config/config";
import type { Marker } from "@/types/Marker";
import ModalMessage from "./ModalMessage";
import MapLayer from "./MapLayer";
import ResourcesInMapList from "./ResourcesInMapList";
import CreateResourceTab from "./CreateResourceTab";

interface Resource {
  id: string;
  x: number;
  y: number;
  resourcetype: string;
  quality: number;
  description: string;
  harvested: string;
  token?: string;
}

interface Map {
  mapid: string;
  name: string;
  dateofburning: string;
  allowedit: boolean;
  pass?: string;
  discordid?: string;
}

interface ResourceMapProps {
  map: Map;
  onReturn: () => void;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

export default function ResourceMap({ map, onReturn }: ResourceMapProps) {
  const t = useTranslations();
  const [userDiscordId] = useState(getStoredItem("discordid"));
  const [token] = useState(getStoredItem("token"));
  const [coordinateXInput, setCoordinateXInput] = useState(0);
  const [coordinateYInput, setCoordinateYInput] = useState(0);
  const [items, setItems] = useState<Marker[]>([]);
  const [resourcesInTheMap, setResourcesInTheMap] = useState<Resource[]>([]);
  const [pass, setPass] = useState(map?.pass ?? "");
  const [textSuccess, setTextSuccess] = useState<string | null>(null);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [mapName, setMapName] = useState(map?.name ?? "");
  const [dateOfBurning, setDateOfBurning] = useState(map?.dateofburning ?? "");
  const [allowEditing, setAllowEditing] = useState(map?.allowedit ?? false);
  const [resourcesFiltered, setResourcesFiltered] = useState<Resource[]>([]);
  const [isOpenSidebar, setIsOpenSidebar] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1440
  );
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const markers = await getMarkers();
      setItems(markers);

      const response = await fetch(
        `${config.API_URL}/maps/${map.mapid}/resources?pass=${map.pass}`
      );
      if (response.ok) {
        const resources = await response.json();
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
    resourceTypeInput: string,
    qualityInput: number,
    descriptionInput: string,
    lastHarvested: string
  ) => {
    try {
      const response = await fetch(
        `${config.API_URL}/maps/${map.mapid}/resources`,
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
  };

  const handleChangeDataMap = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`${config.API_URL}/maps/${map.mapid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: mapName,
          dateofburning: dateOfBurning,
          allowedit: allowEditing,
          pass,
        }),
      });

      const data = await response.text();
      setTextSuccess(data);
    } catch {
      setError("Error when connecting to the API");
    }
  };

  const handleDeleteResource = async (
    resourceId: string,
    resourceToken: string
  ) => {
    try {
      const response = await fetch(
        `${config.API_URL}/maps/${map.mapid}/resources/${resourceId}?token=${resourceToken}`,
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
  };

  const handleFilterResources = (resourceType: string) => {
    if (resourceType === "All") {
      setResourcesFiltered([]);
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
        <div className="card-body">
          <form onSubmit={handleChangeDataMap}>
            <div className="form-group">
              <label htmlFor="mapname">{t("Map Name")}</label>
              <input
                type="text"
                className="form-control"
                id="mapname"
                value={mapName}
                maxLength={30}
                onChange={(e) => setMapName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mapdate">{t("Date of burning")}</label>
              <input
                type="date"
                className="form-control"
                id="mapdate"
                value={dateOfBurning}
                onChange={(e) => setDateOfBurning(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <p>{t("Enable editing with the link")}</p>
              <div className="btn-group">
                <button
                  type="button"
                  className={`btn btn-success ${allowEditing ? "active" : ""}`}
                  onClick={() => setAllowEditing(true)}
                >
                  {t("Allow Editing")}
                </button>
                <button
                  type="button"
                  className={`btn btn-danger ${allowEditing ? "" : "active"}`}
                  onClick={() => setAllowEditing(false)}
                >
                  {t("Read Only")}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">{t("Password")}</label>
              <input
                type="text"
                className="form-control"
                id="password"
                value={pass}
                maxLength={20}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-lg btn-outline-success btn-block"
            >
              {t("Update Data")}
            </button>
          </form>
        </div>
      );
    }
    return null;
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
    <div className="row flex-xl-nowrap">
      <div
        id="map-sidebar"
        className={
          isOpenSidebar
            ? "col-xl-3 col-sm-12 position-absolute bg-secondary p-1 open"
            : "position-absolute bg-secondary p-1"
        }
      >
        <div>
          <button
            type="button"
            className="btn btn-sm btn-primary btn-block mb-2"
            onClick={onReturn}
          >
            <i className="fas fa-arrow-left" /> {t("Return")}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary btn-block mb-2"
            onClick={() => setIsOpenSidebar(!isOpenSidebar)}
          >
            <i className={`fas fa-${isOpenSidebar ? "times" : "bars"}`} />
          </button>
        </div>
        <div className="accordion" id="accordionExample">
          <div className="card bg-secondary">
            <div className="card-header" id="headingOne">
              <h2 className="mb-0">
                <button
                  className="btn btn-link text-white"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  {t("Resources")}
                </button>
              </h2>
            </div>
            <div
              id="collapseOne"
              className="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordionExample"
            >
              <div className="card-body">
                <ResourcesInMapList
                  resources={
                    resourcesFiltered.length > 0
                      ? resourcesFiltered
                      : resourcesInTheMap
                  }
                  onDelete={handleDeleteResource}
                  onFilter={handleFilterResources}
                />
              </div>
            </div>
          </div>
          <div className="card bg-secondary">
            <div className="card-header" id="headingTwo">
              <h2 className="mb-0">
                <button
                  className="btn btn-link text-white collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  {t("Create Resource")}
                </button>
              </h2>
            </div>
            <div
              id="collapseTwo"
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionExample"
            >
              <div className="card-body">
                <CreateResourceTab
                  items={items}
                  coordinateX={coordinateXInput}
                  coordinateY={coordinateYInput}
                  onCreateResource={handleCreateResource}
                />
              </div>
            </div>
          </div>
          <div className="card bg-secondary">
            <div className="card-header" id="headingThree">
              <h2 className="mb-0">
                <button
                  className="btn btn-link text-white collapsed"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  {t("Edit Map")}
                </button>
              </h2>
            </div>
            <div
              id="collapseThree"
              className="collapse"
              aria-labelledby="headingThree"
              data-parent="#accordionExample"
            >
              {renderEditMapTab()}
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-12 p-0">
        <MapLayer
          map={map}
          resources={
            resourcesFiltered.length > 0 ? resourcesFiltered : resourcesInTheMap
          }
          onSetCoordinates={(x: number, y: number) => {
            setCoordinateXInput(x);
            setCoordinateYInput(y);
          }}
          center={center}
          onSetCenter={setCenter}
        />
      </div>
    </div>
  );
}
