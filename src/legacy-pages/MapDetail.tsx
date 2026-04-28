import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@components/LoadingScreen";
import ModalMessage from "@components/ModalMessage";
import HeaderMeta from "@components/HeaderMeta";
import ResourceMap from "@components/ClanMaps/ResourceMap";
import { getMapInfo } from "@functions/requests/maps";
import { getDomain } from "@functions/utils";
import type { MapInfo } from "@ctypes/dto/maps";
import { useLanguagePrefix } from "@hooks/useLanguagePrefix";

const MapDetail: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { getLanguagePrefixedPath } = useLanguagePrefix();
  const [map, setMap] = useState<MapInfo>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchMap = useCallback(async () => {
    const currentId = Array.isArray(id) ? id[0] : id;
    if (!currentId) {
      router.push(getLanguagePrefixedPath("/maps"));
      return;
    }

    setIsLoading(true);
    try {
      const mapData = await getMapInfo(Number(currentId));
      setMap(mapData);
    } catch {
      setError("errors.apiConnection");
    } finally {
      setIsLoading(false);
    }
  }, [id, router, getLanguagePrefixedPath]);

  useEffect(() => {
    fetchMap();
  }, [fetchMap]);

  const handleReturn = useCallback(() => {
    router.push(getLanguagePrefixedPath("/maps"));
  }, [router, getLanguagePrefixedPath]);

  const canonicalUrl = useMemo(() => {
    return `${getDomain()}/maps/${map?.mapid}`;
  }, [map?.mapid]);

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
