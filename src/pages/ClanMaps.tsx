import React ,{ useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import ModalMessage from "../components/ModalMessage";
import ClanMapItem from "../components/ClanMaps/ClanMapItem";
import ResourceMap from "../components/ClanMaps/ResourceMap";
import CreateMapPanel from "../components/ClanMaps/CreateMapPanel";
import { getDomain } from "../functions/utils";
import { getMaps, addMap, deleteMap } from "../functions/requests/maps";
import {
  getMapNames,
} from "../functions/services";
import type { MapInfo, MapJsonInfo } from "../types/dto/maps";

const DeleteMapModal = React.lazy(
  () => import("./DeleteMapModal"),
);

const ClanMaps = () => {
  const { t } = useTranslation();
  const [clanMaps, setClanMaps] = useState<MapInfo[]>([]);
  const [maps, setMaps] = useState<MapJsonInfo[]>([]);
  const [error, setError] = useState<string>();
  const [mapToShow, setMapToShow] = useState<MapInfo>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idMapToDelete, setIdMapToDelete] = useState<number>();

  const fetchMaps = useCallback(async () => {
    try {
      const maps = await getMapNames();
      setMaps(maps);

      const response = await getMaps();
      setClanMaps(response);
    } catch {
      setError("errors.apiConnection");
    }
  }, []);

  useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  const renderClanMapList = () => {
    if (!clanMaps|| !maps) {
      return "";
    }

    return clanMaps.map((map) => (
      <ClanMapItem
        key={`clanmap${map.mapid}`}
        map={map}
        value={map.typemap}
        onOpen={(mapData) => setMapToShow(mapData)}
        onDelete={(mapid) => {
          setIdMapToDelete(mapid);
          setShowDeleteModal(true);
        }}
      />
    ));
  };

  const handleDeleteMap = async (mapid: number) => {
    try {
      await deleteMap(mapid);
      setIdMapToDelete(undefined);
      setShowDeleteModal(false);
    } catch {
      setError("errors.apiConnection");
    }
  };

  const handleCreateMap = async (
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
        {maps && <CreateMapPanel maps={maps} onCreateMap={handleCreateMap} />}
        {showDeleteModal && idMapToDelete && <DeleteMapModal idMap={idMapToDelete} onDeleteMap={handleDeleteMap} onCancel={() => {
          setIdMapToDelete(undefined);
          setShowDeleteModal(false);
        }} />}
      </div>
    );
  };

  if (mapToShow) {
    return (
      <ResourceMap
        key={`mapOpen${mapToShow.mapid}`}
        onReturn={() => setMapToShow(undefined)}
        map={mapToShow}
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

  return <div className="container mx-auto px-4">{renderPanel()}</div>;
};

export default ClanMaps;
