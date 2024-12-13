import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import ModalMessage from "../components/ModalMessage";
import ClanMapItem from "../components/ClanMaps/ClanMapItem";
import ResourceMap from "../components/ClanMaps/ResourceMap";
import CreateMapPanel from "../components/ClanMaps/CreateMapPanel";
import { getDomain } from "../functions/utils";
import { getMaps, createMap, deleteMap } from "../functions/requests/maps";
import {
  closeSession,
  getMapNames,
  getStoredItem,
} from "../functions/services";

const ClanMaps = () => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    user_discord_id: getStoredItem("discordid"),
    maps: false,
    clanMaps: false,
    error: false,
    mapThatIsOpen: false,
    showDeleteModal: false,
    idMapDeleteModal: false,
  });

  const fetchMaps = useCallback(async () => {
    const maps = await getMapNames();
    setState((prev) => ({ ...prev, maps }));

    try {
      const response = await getMaps();

      if (response.status === 200) {
        const data = await response.json();
        setState((prev) => ({ ...prev, clanMaps: data }));
      } else if (response.status === 401) {
        closeSession();
        setState((prev) => ({
          ...prev,
          error: "You don't have access here, try to log in again",
        }));
      } else if (response.status === 503) {
        setState((prev) => ({
          ...prev,
          error: "Error connecting to database",
        }));
      }
    } catch {
      setState((prev) => ({ ...prev, error: "Error connecting to database" }));
    }
  }, []);

  useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  const renderClanMapList = () => {
    if (!state.clanMaps || !state.maps) {
      return "";
    }

    return state.clanMaps.map((map) => (
      <ClanMapItem
        key={`clanmap${map.mapid}`}
        map={map}
        value={map.typemap}
        onOpen={(mapData) => {
          setState((prev) => ({ ...prev, mapThatIsOpen: mapData }));
        }}
        onDelete={(mapid) => {
          setState((prev) => ({
            ...prev,
            showDeleteModal: true,
            idMapDeleteModal: mapid,
          }));
        }}
      />
    ));
  };

  const handleDeleteMap = async (mapid) => {
    try {
      const response = await deleteMap(mapid);

      if (response.status === 204) {
        setState((prev) => ({
          ...prev,
          showDeleteModal: false,
          idMapDeleteModal: false,
        }));
        fetchMaps();
      } else if (response.status === 401) {
        closeSession();
        setState((prev) => ({
          ...prev,
          error: "You don't have access here, try to log in again",
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: "Error when connecting to the API",
      }));
    }
  };

  const handleCreateMap = async (
    event,
    mapNameInput,
    mapDateInput,
    mapSelectInput
  ) => {
    event.preventDefault();

    try {
      const response = await createMap(
        mapNameInput,
        mapDateInput,
        mapSelectInput
      );

      setState((prev) => ({
        ...prev,
        mapNameInput: "",
        mapDateInput: "",
        mapSelectInput: "",
      }));

      if (response.status === 201) {
        fetchMaps();
      } else if (response.status === 401) {
        closeSession();
        setState((prev) => ({ ...prev, error: "Login again" }));
      } else if (response.status === 503) {
        setState((prev) => ({
          ...prev,
          error: "Error connecting to database",
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: "Error when connecting to the API",
      }));
    }
  };

  const renderPanel = () => {
    const showHideClassName = state.showDeleteModal
      ? "modal d-block"
      : "modal d-none";
    return (
      <div className="row">
        <Helmet>
          <title>Interactive Map List - Stiletto for Last Oasis</title>
          <meta
            name="description"
            content="Create, edit and share game maps by adding markers to them, e.g. to show where there is quality material or an enemy base."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Map List - Stiletto for Last Oasis"
          />
          <meta
            name="twitter:description"
            content="Create, edit and share game maps by adding markers to them, e.g. to show where there is quality material or an enemy base."
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
          />
          <link rel="canonical" href={`${getDomain()}/maps`} />
        </Helmet>
        <div className="col-xl-12">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Map List")}</div>
            <div className="card-body row">{renderClanMapList()}</div>
          </div>
        </div>
        <CreateMapPanel maps={state.maps} onCreateMap={handleCreateMap} />
        <div className={showHideClassName}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deletemapmodal">
                  {t("Are you sure?")}
                </h5>
              </div>
              <div className="modal-body">
                {t("This option is not reversible")}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      showDeleteModal: false,
                      idMapDeleteModal: false,
                    }))
                  }
                >
                  {t("Cancel")}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteMap(state.idMapDeleteModal)}
                >
                  {t("Delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (state.mapThatIsOpen) {
    return (
      <ResourceMap
        key={`mapOpen${state.mapThatIsOpen.mapid}`}
        onReturn={() => setState((prev) => ({ ...prev, mapThatIsOpen: false }))}
        map={state.mapThatIsOpen}
      />
    );
  }

  if (state.error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: state.error,
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (!state.user_discord_id) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: "Login again",
          redirectPage: "/profile",
        }}
      />
    );
  }

  return <div className="container">{renderPanel()}</div>;
};

export default ClanMaps;
