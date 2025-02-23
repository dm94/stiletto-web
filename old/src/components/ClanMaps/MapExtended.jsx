import RasterCoords from "leaflet-rastercoords";
import { Map } from "react-leaflet";

class MapExtended extends Map {
  createLeafletElement(props) {
    const leafletMapElement = super.createLeafletElement(props);
    const img = [4065, 4065];

    const rc = new RasterCoords(leafletMapElement, img);

    leafletMapElement.setView(rc.unproject([img[0], img[1]]), 2);

    return leafletMapElement;
  }
}

export default MapExtended;
