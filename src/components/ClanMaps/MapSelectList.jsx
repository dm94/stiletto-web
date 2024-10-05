import React, { Component } from "react";

class MapSelectList extends Component {
  state = {};
  render() {
    if (this.props?.maps != null) {
      return this.props?.maps.map((map) => (
        <div
          tabIndex={0}
          role="button"
          className="p-2 col-sm-4 col-xl-2 text-center"
          key={`selectmap${map.idMap}`}
          onClick={(evt) => this.props?.onSelectMap(evt.target.id)}
        >
          <img
            src={map.image}
            className={
              map.name === this.props?.mapSelectInput
                ? "img-fluid img-thumbnail"
                : "img-fluid"
            }
            alt={map.name}
            id={map.name}
          />
          <h6>{map.name}</h6>
        </div>
      ));
    }
    return "";
  }
}

export default MapSelectList;
