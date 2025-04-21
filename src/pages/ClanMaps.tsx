import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
  memo,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import ModalMessage from "../components/ModalMessage";
import ClanMapItem from "../components/ClanMaps/ClanMapItem";
import CreateMapPanel from "../components/ClanMaps/CreateMapPanel";
import { getDomain } from "../functions/utils";
import { getMaps, addMap, deleteMap } from "../functions/requests/maps";
import { getMapNames } from "../functions/services";
import type { MapInfo, MapJsonInfo } from "../types/dto/maps";
import LoadingScreen from "../components/LoadingScreen";

const DeleteMapModal = React.lazy(
  () => import("../components/ClanMaps/DeleteMapModal"),
);

const ClanMaps = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [clanMaps, setClanMaps] = useState<MapInfo[]>([]);
  const [maps, setMaps] = useState<MapJsonInfo[]>([]);
  const [error, setError] = useState<string>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idMapToDelete, setIdMapToDelete] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchMaps = useCallback(async () => {
    setIsLoading(true);
    try {
      const [mapNames, mapResponse] = await Promise.all([
        getMapNames(),
        getMaps(),
      ]);

      setMaps(mapNames);
      setClanMaps(mapResponse);
    } catch {
      setError("errors.apiConnection");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaps();

    return () => {
      // Cleanup function
      setClanMaps([]);
      setMaps([]);
    };
  }, [fetchMaps]);

  const handleDeleteMap = useCallback(
    async (mapid: number) => {
      try {
        await deleteMap(mapid);
        setIdMapToDelete(undefined);
        setShowDeleteModal(false);
        fetchMaps(); // Refresh the maps list after deletion
      } catch {
        setError("errors.apiConnection");
      }
    },
    [fetchMaps],
  );

  const handleCreateMap = useCallback(
    async (
      mapNameInput: string,
      mapDateInput: string,
      mapSelectInput: string,
    ) => {
      try {
        await addMap({
          mapname: mapNameInput,
          mapdate: mapDateInput,
          maptype: mapSelectInput,
        });

        fetchMaps();
      } catch {
        setError("errors.apiConnection");
      }
    },
    [fetchMaps],
  );

  const handleOpenMap = useCallback(
    (mapData: MapInfo) => {
      navigate(`/maps/${mapData.mapid}`);
    },
    [navigate],
  );

  const handleCancelDelete = useCallback(() => {
    setIdMapToDelete(undefined);
    setShowDeleteModal(false);
  }, []);

  const handleShowDeleteModal = useCallback((mapid: number) => {
    setIdMapToDelete(mapid);
    setShowDeleteModal(true);
  }, []);

  const renderClanMapList = useMemo(() => {
    if (!clanMaps || !maps || clanMaps.length === 0) {
      return "";
    }

    return clanMaps.map((map) => (
      <ClanMapItem
        key={`clanmap${map.mapid}`}
        map={map}
        value={map.typemap}
        onOpen={handleOpenMap}
        onDelete={handleShowDeleteModal}
      />
    ));
  }, [clanMaps, maps, handleOpenMap, handleShowDeleteModal]);

  const renderHelmet = useMemo(
    () => (
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
    ),
    [],
  );

  const renderPanel = useMemo(() => {
    return (
      <div className="container mx-auto px-4">
        {renderHelmet}
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="w-full">
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
                <div className="p-4 bg-gray-900 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-300">
                    {t("maps.mapList")}
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderClanMapList}
                  </div>
                </div>
              </div>
            </div>
            {maps && (
              <CreateMapPanel maps={maps} onCreateMap={handleCreateMap} />
            )}
            {showDeleteModal && idMapToDelete && (
              <Suspense fallback={<LoadingScreen />}>
                <DeleteMapModal
                  idMap={idMapToDelete}
                  onDeleteMap={handleDeleteMap}
                  onCancel={handleCancelDelete}
                />
              </Suspense>
            )}
          </>
        )}
      </div>
    );
  }, [
    renderHelmet,
    isLoading,
    renderClanMapList,
    maps,
    handleCreateMap,
    showDeleteModal,
    idMapToDelete,
    handleDeleteMap,
    handleCancelDelete,
    t,
  ]);

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

  return <div className="container mx-auto px-4">{renderPanel}</div>;
};

export default memo(ClanMaps);
