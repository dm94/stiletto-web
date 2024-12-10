import React from "react";

const MapSelectList = ({ maps, mapSelectInput, onSelectMap }) => {
  if (maps) {
    return maps.map((map) => (
      <button
        type="button"
        className="p-2 col-sm-4 col-xl-2 text-center"
        key={`selectmap${map.idMap}`}
        onClick={(evt) => onSelectMap(evt.target.id)}
      >
        <img
          src={map.image}
          className={
            map.name === mapSelectInput
              ? "img-fluid img-thumbnail"
              : "img-fluid"
          }
          alt={map.name}
          id={map.name}
        />
        <h6>{map.name}</h6>
      </button>
    ));
  }
  return "";
};

export default MapSelectList;
