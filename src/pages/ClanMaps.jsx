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
          error: "errors.noAccess",
        }));
      } else if (response.status === 503) {
        setState((prev) => ({
          ...prev,
          error: "error.databaseConnection",
        }));
      }
    } catch {
      setState((prev) => ({ ...prev, error: "error.databaseConnection" }));
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
          error: "errors.noAccess",
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: "errors.apiConnection",
      }));
    }
  };

  const handleCreateMap = async (
    event,
    mapNameInput,
    mapDateInput,
    mapSelectInput,
  ) => {
    event.preventDefault();

    try {
      const response = await createMap(
        mapNameInput,
        mapDateInput,
        mapSelectInput,
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
        setState((prev) => ({ ...prev, error: "auth.loginAgain2" }));
      } else if (response.status === 503) {
        setState((prev) => ({
          ...prev,
          error: "error.databaseConnection",
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: "errors.apiConnection",
      }));
    }
  };

  const renderPanel = () => {
    const showHideClassName = state.showDeleteModal
      ? "fixed inset-0 z-50 overflow-y-auto"
      : "hidden";
    return (
      <div className="container mx-auto px-4">
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
        <div className="w-full">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
            <div className="p-4 bg-gray-900 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-gray-300">
                {t("maps.mapList")}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderClanMapList()}
              </div>
            </div>
          </div>
        </div>
        <CreateMapPanel maps={state.maps} onCreateMap={handleCreateMap} />
        <div className={showHideClassName}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75" />
            </div>
            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-300"
                      id="deletemapmodal"
                    >
                      {t("common.areYouSure")}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        {t("common.notReversible")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteMap(state.idMapDeleteModal)}
                >
                  {t("common.delete")}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      showDeleteModal: false,
                      idMapDeleteModal: false,
                    }))
                  }
                >
                  {t("common.cancel")}
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
          text: "auth.loginAgain2",
          redirectPage: "/profile",
        }}
      />
    );
  }

  return <div className="container mx-auto px-4">{renderPanel()}</div>;
};

export default ClanMaps;
