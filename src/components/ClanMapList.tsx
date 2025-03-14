"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem, closeSession } from "@/lib/services";
import ClanMapItem from "./ClanMapItem";

interface Map {
  mapid: string;
  name: string;
  dateofburning: string;
  discordid?: string;
  discordTag?: string;
  pass?: string;
}

interface ClanMapListProps {
  clanid?: string;
  onError?: (error: string) => void;
  onOpenMap?: (map: Map) => void;
}

export default function ClanMapList({
  clanid,
  onError,
  onOpenMap,
}: ClanMapListProps) {
  const t = useTranslations();
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaps = async () => {
      if (!clanid) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${config.API_URL}/clans/${clanid}/maps`, {
          headers: {
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setMaps(data);
        } else if (response.status === 401) {
          closeSession();
          onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
        } else if (response.status === 503) {
          onError?.("Error al conectar con la base de datos");
        }
      } catch {
        onError?.("Error al conectar con la API");
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, [clanid, onError]);

  const handleDeleteMap = async (mapid: string) => {
    if (!clanid) {
      return;
    }

    try {
      const response = await fetch(
        `${config.API_URL}/clans/${clanid}/maps/${mapid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
        }
      );

      if (response.status === 204) {
        setMaps(maps.filter((map) => map.mapid !== mapid));
      } else if (response.status === 401) {
        closeSession();
        onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
      } else if (response.status === 503) {
        onError?.("Error al conectar con la base de datos");
      }
    } catch {
      onError?.("Error al conectar con la API");
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border">
          <span className="visually-hidden">{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  if (!maps.length) {
    return <div className="alert alert-info">{t("No maps found")}</div>;
  }

  return (
    <div className="row">
      {maps.map((map) => (
        <ClanMapItem
          key={map.mapid}
          map={map}
          value={map.name}
          onOpen={onOpenMap}
          onDelete={handleDeleteMap}
        />
      ))}
    </div>
  );
}
