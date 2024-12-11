import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import {
  updateResourceTime,
  getMarkers,
  getResources,
  deleteResource,
  createResource,
} from "../../services";
import LoadingScreen from "../LoadingScreen";
import ModalMessage from "../ModalMessage";
import MapLayer from "./MapLayer";
import ResourcesInMapList from "./ResourcesInMapList";
import CreateResourceTab from "./CreateResourceTab";
import { getMap } from "../../functions/requests/maps";
import "../../css/map-sidebar.min.css";

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

  const fetchData = useCallback(async () => {
    let parsed = null;
    if (props?.location?.search) {
      parsed = queryString.parse(props.location.search);
    }

    if (
      (props?.mapId || props?.match?.params?.id) &&
      (props?.pass || parsed?.pass)
    ) {
      const markers = await getMarkers();
      setItems(markers);

      const currentMapId = props?.mapId || props?.match?.params?.id;
      const currentPass = props?.pass || parsed?.pass;

      setMapId(currentMapId);
      setPass(currentPass);

      const resourcesData = await getResources(currentMapId, currentPass);
      if (resourcesData.success) {
        setResourcesInTheMap(resourcesData.message);
      } else {
        setError(resourcesData.message);
      }

      const response = await getMap(currentMapId, currentPass);
      if (response.success) {
        setMapData(response.data);
      } else {
        setError(response.message);
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
      const response = await deleteResource(mapId, resourceId, resourceToken);
      if (response.success) {
        fetchData();
      } else {
        setError(response.message);
      }
    },
    [mapId, fetchData]
  );

  const handleCreateResource = useCallback(
    async (
      resourceTypeInput,
      qualityInput,
      descriptionInput,
      lastHarvested
    ) => {
      const response = await createResource(
        mapId,
        coordinateXInput,
        coordinateYInput,
        pass,
        resourceTypeInput,
        qualityInput,
        descriptionInput,
        lastHarvested
      );
      if (response.success) {
        fetchData();
      } else {
        setError(response.message);
      }
    },
    [mapId, coordinateXInput, coordinateYInput, pass, fetchData]
  );

  const handleFilterResources = useCallback(
    (resourceType) => {
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
                  onSelect={(x, y) => setCenter([x, y])}
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
                onCreateResource={handleCreateResource}
                coordinateXInput={coordinateXInput}
                coordinateYInput={coordinateYInput}
                onChangeX={setCoordinateXInput}
                onChangeY={setCoordinateYInput}
              />
            </div>
          </div>
        </nav>
      </div>
      <div className="col-12">
        <div className="col-xl-12 text-center">
          <h1>{resourcesInTheMap?.[0]?.name || ""}</h1>
        </div>
        <MapLayer
          key={mapId}
          resourcesInTheMap={resourcesFiltered || resourcesInTheMap}
          deleteResource={handleDeleteResource}
          updateResource={(mapId, resourceId, token, date) => {
            updateResourceTime(mapId, resourceId, token, date);
            fetchData();
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

export default ResourceMapNoLog;
