import React, { useEffect, useRef, forwardRef } from "react";
import L from "leaflet";
import { MapContainer, useMap } from "react-leaflet";
import type { MapContainerProps } from "react-leaflet";

// Import our custom RasterCoords implementation
// This replaces the outdated leaflet-rastercoords library
import { createRasterCoords, type RasterCoordsType } from "./RasterCoordsUtil";

// This component initializes the RasterCoords functionality after the map is loaded
const RasterCoordsInitializer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const img: [number, number] = [4065, 4065];

    // Initialize RasterCoords with the map instance using our custom implementation
    const rc = createRasterCoords(map, img);

    // Set the initial view
    const center = rc.unproject([img[0], img[1]]);
    map.setView(center, 2);

    // Store the rasterCoords instance on the map for potential external access
    (map as any).rasterCoords = rc;
  }, [map]);

  return null;
};

// Create a forwardRef component to properly handle React component requirements
const MapExtended = forwardRef<L.Map, MapContainerProps>((props, ref) => {
  const mapRef = useRef<L.Map | null>(null);

  // Combine the external ref with our internal ref
  const setMapRef = (map: L.Map) => {
    mapRef.current = map;

    if (ref) {
      if (typeof ref === "function") {
        ref(map);
      } else {
        (ref as React.MutableRefObject<L.Map>).current = map;
      }
    }
  };

  return (
    <MapContainer {...props} ref={setMapRef}>
      {props.children}
      <RasterCoordsInitializer />
    </MapContainer>
  );
});

export default MapExtended;
