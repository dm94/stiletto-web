import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import LoadingScreen from "@components/LoadingScreen";
import ModalMessage from "@components/ModalMessage";
import ResourceMap from "@components/ClanMaps/ResourceMap";
import { getMapInfo } from "@functions/requests/maps";
import { getDomain } from "@functions/utils";
import type { MapInfo } from "@ctypes/dto/maps";

const MapDetail: React.FC = () => {
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

  return (
    <>
      <Helmet>
        <title>{map.name} - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="Interactive map with resources and markers for Last Oasis game."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${map.name} - Stiletto for Last Oasis`}
        />
        <meta
          name="twitter:description"
          content="Interactive map with resources and markers for Last Oasis game."
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/maps/${map.mapid}`} />
      </Helmet>
      <ResourceMap map={map} onReturn={handleReturn} />
    </>
  );
};

export default MapDetail;
