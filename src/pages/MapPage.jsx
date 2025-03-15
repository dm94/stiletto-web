import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";
import CreateMapNoLog from "../components/ClanMaps/CreateMapNoLog";
import ResourceMapNoLog from "../components/ClanMaps/ResourceMapNoLog";
import { getDomain } from "../functions/utils";
import HeaderMeta from "../components/HeaderMeta";
import { useLocation } from "react-router";

const MapPage = () => {
  const [mapId, setMapId] = useState(null);
  const [pass, setPass] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    setMapId(parsed.mapid);
    setPass(parsed.pass);
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
          onOpen={(id, p) => {
            setMapId(id);
            setPass(p);
          }}
        />
      )}
    </Fragment>
  );
};

export default MapPage;
