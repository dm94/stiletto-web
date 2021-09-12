import RasterCoords from "leaflet-rastercoords";
import { Map } from "react-leaflet";

class MapExtended extends Map {
  createLeafletElement(props) {
    let leafletMapElement = super.createLeafletElement(props);
    let img = [4065, 4065];

    let rc = new RasterCoords(leafletMapElement, img);

    leafletMapElement.setView(rc.unproject([img[0], img[1]]), 2);

    return leafletMapElement;
  }
}

export default MapExtended;
