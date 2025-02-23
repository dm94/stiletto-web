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
        <div className="card-body">
          <form onSubmit={handleChangeDataMap}>
            <div className="form-group">
              <label htmlFor="mapname">{t("Map Name")}</label>
              <input
                type="text"
                className="form-control"
                id="mapname"
                value={mapName}
                maxLength="30"
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
                maxLength="20"
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
            <i className="fas fa-arrow-left" /> {t("Back to the list of maps")}
          </button>
          <button
            type="button"
            id="toggle-sidebar-button"
            className="btn btn-info ml-2 mb-2 float-right"
            onClick={() => setIsOpenSidebar((prev) => !prev)}
          >
            <i
              className={`fas fa-chevron-${isOpenSidebar ? "left" : "right"}`}
            />
          </button>
        </div>
        <nav className="collapse show" id="items-nav" aria-label="Items Navs">
          <ul className="nav nav-pills nav-fill" role="tablist">
            {(map.allowedit || userDiscordId === map.discordid) && (
              <li className="nav-item" role="presentation">
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
            <li className="nav-item" role="presentation">
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
            {userDiscordId === map.discordid && (
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="edit-map-tab"
                  data-toggle="tab"
                  href="#editmap"
                  role="tab"
                  aria-controls="editmap"
                  aria-selected="false"
                >
                  {t("Edit")}
                </a>
              </li>
            )}
          </ul>
          <div className="tab-content border border-primary">
            <div
              className="tab-pane fade"
              id="addresource"
              role="tabpanel"
              aria-labelledby="add-resource-tab"
            >
              <CreateResourceTab
                items={items}
                onCreateResource={handleCreateResource}
                coordinateXInput={coordinateXInput}
                coordinateYInput={coordinateYInput}
                onChangeX={setCoordinateXInput}
                onChangeY={setCoordinateYInput}
              />
            </div>
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
                  resources={resourcesFiltered || resourcesInTheMap}
                  onSelect={(x, y) => setCenter([x, y])}
                  onFilter={handleFilterResources}
                />
              </ul>
            </div>
            <div
              className="tab-pane fade"
              id="editmap"
              role="tabpanel"
              aria-labelledby="edit-map-tab"
            >
              {renderEditMapTab()}
            </div>
          </div>
        </nav>
      </div>
      <div className="col-12">
        <MapLayer
          key={map.mapid}
          resourcesInTheMap={resourcesInTheMap}
          deleteResource={handleDeleteResource}
          updateResource={(mapid, resourceid, token, date) => {
            try {
              updateResourceTime(mapid, resourceid, token, date);
              fetchData();
            } catch {
              setError("Error when connecting to the API");
            }
          }}
          changeInput={(x, y) => {
            setCoordinateXInput(x);
            setCoordinateYInput(y);
          }}
          center={center}
        />
      </div>
    </div>
  );
};

export default ResourceMap;
