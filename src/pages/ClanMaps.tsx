import React ,{ useState, useEffect, useCallback } from "react";
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
import type { MapInfo, MapJsonInfo } from "../types/dto/maps";

const DeleteMapModal = React.lazy(
  () => import("./DeleteMapModal"),
);

const ClanMaps = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<{
    user_discord_id: string;
    maps?: MapJsonInfo[];
    clanMaps?: MapInfo[];
    error: string;
    showDeleteModal: boolean;
    idMapDeleteModal?: number;
    mapThatIsOpen?: MapInfo;
  }>({
    user_discord_id: getStoredItem("discordid") ?? "",
    clanMaps: [] as MapInfo[],
    error: "",
    showDeleteModal: false,
  });

  const fetchMaps = useCallback(async () => {
    const maps = await getMapNames();
    setState((prev) => ({ ...prev, maps }));

    try {
      const response = await getMaps();

      if (response.status === 200) {
        const data = await response.json() as MapInfo[];
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

  const handleDeleteMap = async (mapid: number) => {
    try {
      const response = await deleteMap(mapid);

      if (response.status === 204) {
        setState((prev) => ({
          ...prev,
          showDeleteModal: false,
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
    mapNameInput: string,
    mapDateInput: string,
    mapSelectInput: string,
  ) => {
    try {
      const response = await createMap({
        mapname: mapNameInput,
        mapdate: mapDateInput,
        maptype: mapSelectInput,
      });

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
        {state.maps && <CreateMapPanel maps={state.maps} onCreateMap={handleCreateMap} />}
        {state.showDeleteModal && state.idMapDeleteModal && <DeleteMapModal idMap={state.idMapDeleteModal} onDeleteMap={handleDeleteMap} onCancel={() => setState({ ...state, showDeleteModal: false })} />}
      </div>
    );
  };

  if (state.mapThatIsOpen) {
    return (
      <ResourceMap
        key={`mapOpen${state.mapThatIsOpen.mapid}`}
        onReturn={() => setState((prev) => ({ ...prev, mapThatIsOpen: undefined }))}
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
