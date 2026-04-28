import type React from "react";
import { useState, useEffect, Fragment } from "react";
import CreateMapNoLog from "@components/ClanMaps/CreateMapNoLog";
import ResourceMapNoLog from "@components/ClanMaps/ResourceMapNoLog";
import { getDomain } from "@functions/utils";
import HeaderMeta from "@components/HeaderMeta";
import { useSearchParams } from "next/navigation";

const MapPage: React.FC = () => {
  const [mapId, setMapId] = useState<number>();
  const [pass, setPass] = useState<string>();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMapId(Number(searchParams?.get("mapid")));
    setPass(searchParams?.get("pass") ?? undefined);
  }, [searchParams]);

  return (
    <Fragment>
      <HeaderMeta
        title="Interactive Resource Map - Stiletto for Last Oasis"
        description="Interactive Map of resources shared through a link"
        canonical={`${getDomain()}/map`}
        image="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
      />
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
    </Fragment>
  );
};

export default MapPage;
