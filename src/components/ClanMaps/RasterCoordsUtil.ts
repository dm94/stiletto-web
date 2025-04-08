/**
 * Custom implementation of leaflet-rastercoords functionality
 * This provides the same functionality as the original library but works with the latest Leaflet version
 */
import L from "leaflet";

/**
 * RasterCoords class for handling image coordinate transformations
 */
export interface RasterCoordsType {
  unproject: (point: [number, number]) => L.LatLng;
  project: (point: [number, number]) => L.Point;
  zoomLevel: () => number;
  getMaxBounds: () => L.LatLngBounds;
  setMaxBounds: () => void;
}

/**
 * Create a RasterCoords instance that provides the same functionality as the original library
 * @param map - Leaflet map instance
 * @param imgsize - Image dimensions [width, height]
 * @param tilesize - Tile size in pixels (default: 256)
 * @param setMaxBounds - Whether to automatically set map max bounds (default: true)
 * @returns RasterCoords instance
 */
export function createRasterCoords(
  map: L.Map,
  imgsize: [number, number],
  tilesize = 256,
  shouldSetMaxBounds = true,
): RasterCoordsType {
  const width = imgsize[0];
  const height = imgsize[1];

  // Calculate the appropriate zoom level for the image
  const zoomLevel = (): number => {
    return Math.ceil(
      Math.log(Math.max(width, height) / tilesize) / Math.log(2),
    );
  };

  const zoom = zoomLevel();

  // Unproject coordinates from image space to map space
  const unproject = (coords: [number, number]): L.LatLng => {
    return map.unproject(coords, zoom);
  };

  // Project coordinates from map space to image space
  const project = (coords: L.LatLngExpression): L.Point => {
    return map.project(coords, zoom);
  };

  // Get the maximum bounds of the image
  const getMaxBounds = (): L.LatLngBounds => {
    const southWest = unproject([0, height]);
    const northEast = unproject([width, 0]);
    return new L.LatLngBounds(southWest, northEast);
  };

  // Set the maximum bounds on the map
  const setMaxBounds = (): void => {
    const bounds = getMaxBounds();
    map.setMaxBounds(bounds);
  };

  // Automatically set max bounds if requested
  if (shouldSetMaxBounds && width && height) {
    setMaxBounds();
  }

  return {
    unproject,
    project,
    zoomLevel,
    getMaxBounds,
    setMaxBounds,
  };
}
