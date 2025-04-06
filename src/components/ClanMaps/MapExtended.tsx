import type React from "react";
import { useEffect, useRef, forwardRef } from "react";
import type L from "leaflet";
import { MapContainer, useMap } from "react-leaflet";
import type { MapContainerProps } from "react-leaflet";

// Import our custom RasterCoords implementation
// This replaces the outdated leaflet-rastercoords library
import { createRasterCoords } from "./RasterCoordsUtil";

// This component initializes the RasterCoords functionality after the map is loaded
const RasterCoordsInitializer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const img: [number, number] = [4065, 4065];

    // Initialize RasterCoords with the map instance using our custom implementation
    const rc = createRasterCoords(map, img);

    // Set the initial view to the center of the image
    // Calculate the center coordinates of the image
    const centerX = img[0] / 2;
    const centerY = img[1] / 2;
    const center = rc.unproject([centerX, centerY]);
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
        (ref as React.RefObject<L.Map>).current = map;
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
