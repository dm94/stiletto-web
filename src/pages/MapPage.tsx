import type React from "react";
import { useState, useEffect, Fragment } from "react";
import queryString from "query-string";
import CreateMapNoLog from "@components/ClanMaps/CreateMapNoLog";
import ResourceMapNoLog from "@components/ClanMaps/ResourceMapNoLog";
import { getDomain } from "@functions/utils";
import HeaderMeta from "@components/HeaderMeta";
import { useLocation } from "react-router";

const MapPage: React.FC = () => {
  const [mapId, setMapId] = useState<number>();
  const [pass, setPass] = useState<string>();
  const location = useLocation();

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    setMapId(Number(parsed.mapid));
    setPass(parsed.pass as string);
  }, [location.search]);

  return (
    <Fragment>
      <HeaderMeta
        title="Interactive Resource Map - Stiletto for Last Oasis"
        description="Interactive Map of resources shared through a link"
        cannonical={`${getDomain()}/map`}
      >
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
        />
      </HeaderMeta>
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
