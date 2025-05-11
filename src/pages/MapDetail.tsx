import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@components/LoadingScreen";
import ModalMessage from "@components/ModalMessage";
import HeaderMeta from "@components/HeaderMeta";
import ResourceMap from "@components/ClanMaps/ResourceMap";
import { getMapInfo } from "@functions/requests/maps";
import { getDomain } from "@functions/utils";
import type { MapInfo } from "@ctypes/dto/maps";

const MapDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [map, setMap] = useState<MapInfo>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchMap = useCallback(async () => {
    if (!id) {
      navigate("/maps");
      return;
    }

    setIsLoading(true);
    try {
      const mapData = await getMapInfo(Number(id));
      setMap(mapData);
    } catch {
      setError("errors.apiConnection");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchMap();
  }, [fetchMap]);

  const handleReturn = useCallback(() => {
    navigate("/maps");
  }, [navigate]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/maps",
        }}
      />
    );
  }

  if (!map) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: "maps.mapNotFound",
          redirectPage: "/maps",
        }}
      />
    );
  }

  const canonicalUrl = useMemo(() => {
    return `${getDomain()}/maps/${map?.mapid}`;
  }, [map?.mapid]);

  return (
    <>
      <HeaderMeta
        title={`${map?.name} map - Stiletto for Last Oasis`}
        description={t(
          "seo.mapDetail.description",
          "Interactive map with resources and markers for Last Oasis game",
        )}
        canonical={canonicalUrl}
        image="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
        keywords="Last Oasis, interactive map, game resources, resource markers, clan territory, game locations"
      />
      <ResourceMap map={map} onReturn={handleReturn} />
    </>
  );
};

export default MapDetail;
