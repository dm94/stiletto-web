import React, { Component } from "react";

class MapSelectList extends Component {
  state = {};
  render() {
    if (this.props.maps != null) {
      return this.props.maps.map((map) => (
        <div
          className="m-2 col-sm-2 col-xl text-center"
          key={"selectmap" + map.idMap}
        >
          <img
            src={map.image}
            className={
              map.name === this.props.mapSelectInput
                ? "img-fluid img-thumbnail"
                : "img-fluid"
            }
            alt={map.name}
            id={map.name}
            onClick={(evt) => this.props.onSelectMap(evt.target.id)}
          />
          <h6>{map.name}</h6>
        </div>
      ));
    } else {
      return "";
    }
  }
}

export default MapSelectList;
