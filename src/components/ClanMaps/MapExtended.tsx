// @ts-ignore
import RasterCoords from "leaflet-rastercoords";
// @ts-ignore
import { Map as ReactLeafletMap, type MapProps } from "react-leaflet";
// @ts-ignore
import type { Map as LeafletMap } from "leaflet";
import React from "react";

// Define interface for RasterCoords since it doesn't have TypeScript definitions
interface RasterCoordsType {
  unproject: (point: [number, number]) => [number, number];
  project: (point: [number, number]) => [number, number];
}

// Create a React component that wraps the ReactLeafletMap
class MapExtendedClass extends ReactLeafletMap<MapProps> {
  createLeafletElement(props: MapProps): LeafletMap {
    const leafletMapElement = super.createLeafletElement(props);
    const img: [number, number] = [4065, 4065];

    // Cast to any since we don't have proper type definitions for leaflet-rastercoords
    const rc = new (RasterCoords as any)(
      leafletMapElement,
      img,
    ) as RasterCoordsType;

    leafletMapElement.setView(rc.unproject([img[0], img[1]]), 2);

    return leafletMapElement;
  }
}

// Create a forwardRef component to properly handle React component requirements
const MapExtended = React.forwardRef<MapExtendedClass, MapProps>(
  (props, ref) => {
    // @ts-expect-error
    return <MapExtendedClass {...props} ref={ref} />;
  },
);

export default MapExtended;
