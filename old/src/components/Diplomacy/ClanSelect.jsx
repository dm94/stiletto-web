import React, { useState } from "react";
import ClanName from "../ClanName";

const ClanSelect = ({ leader, clan, onDelete }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className="row"
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onBlur={() => setIsHover(false)}
    >
      <div className={leader && isHover ? "d-none" : "col-12"}>
        <ClanName clan={clan} />
      </div>
      <div className={leader && isHover ? "col-10" : "d-none"}>
        <ClanName clan={clan} />
      </div>
      <div className={leader && isHover ? "col-2" : "d-none"}>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(clan?.id)}
        >
          <i className="fas fa-trash" />
        </button>
      </div>
    </div>
  );
};

export default ClanSelect;
