"use client";

import type React from "react";
import { useState, useEffect } from "react";
import CreateMapNoLog from "@components/ClanMaps/CreateMapNoLog";
import ResourceMapNoLog from "@components/ClanMaps/ResourceMapNoLog";
import { useSearchParams } from "next/navigation";

const MapPage: React.FC = () => {
  const [mapId, setMapId] = useState<number>();
  const [pass, setPass] = useState<string>();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mapIdParam = searchParams.get("mapid");
    const passParam = searchParams.get("pass");
    if (mapIdParam) {
      setMapId(Number(mapIdParam));
    }
    if (passParam) {
      setPass(passParam);
    }
  }, [searchParams]);

  return (
    <>
      {mapId && pass ? (
        <ResourceMapNoLog mapId={mapId} pass={pass} />
      ) : (
        <CreateMapNoLog
          onOpen={(id: number, pass: string) => {
            setMapId(id);
            setPass(pass);
          }}
        />
      )}
    </>
  );
};

export default MapPage;
