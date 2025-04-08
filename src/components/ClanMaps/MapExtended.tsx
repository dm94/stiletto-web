import type React from "react";
import { useEffect, useRef, forwardRef } from "react";
import L from "leaflet";
import { MapContainer, useMap } from "react-leaflet";
import type { MapContainerProps } from "react-leaflet";

// Import our custom RasterCoords implementation
import { createRasterCoords } from "./RasterCoordsUtil";

// This component initializes the RasterCoords functionality after the map is loaded
interface RasterCoordsInitializerProps {
  center?: [number, number];
}

const RasterCoordsInitializer: React.FC<RasterCoordsInitializerProps> = ({
  center,
}) => {
  const map = useMap();
  const initializedRef = useRef(false);

  useEffect(() => {
    const img: [number, number] = [4065, 4065];

    // Initialize RasterCoords with the map instance using our custom implementation
    const rc = createRasterCoords(map, img);

    // Set the initial view to the center of the image if no center is provided
    // Calculate the center coordinates of the image
    const centerX = img[0] / 2;
    const centerY = img[1] / 2;
    const defaultCenter = rc.unproject([centerX, centerY]);

    // Use the provided center or default to the center of the image
    // Only set the view if this is the initial render
    if (!initializedRef.current) {
      map.setView(
        center ? new L.LatLng(center[0], center[1]) : defaultCenter,
        2,
      );
      initializedRef.current = true;
    }

    // Store the rasterCoords instance on the map for potential external access
    (map as any).rasterCoords = rc;
  }, [map, center]); // Include center in dependencies to handle updates

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
      <RasterCoordsInitializer
        center={props.center as [number, number] | undefined}
      />
    </MapContainer>
  );
});

export default MapExtended;
