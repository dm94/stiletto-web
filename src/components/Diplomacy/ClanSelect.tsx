import React, { useState } from "react";
import ClanName from "../ClanName";

interface ClanSelectProps {
  leader: boolean;
  clan: {
    id: number;
    [key: string]: any;
  };
  onDelete: (id: number) => void;
}

const ClanSelect: React.FC<ClanSelectProps> = ({ leader, clan, onDelete }) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className="flex items-center"
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onBlur={() => setIsHover(false)}
    >
      <div className={leader && isHover ? "hidden" : "w-full"}>
        <ClanName clan={clan} />
      </div>
      <div className={leader && isHover ? "flex-grow" : "hidden"}>
        <ClanName clan={clan} />
      </div>
      <div className={leader && isHover ? "ml-2" : "hidden"}>
        <button
          type="button"
          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => onDelete(clan?.id)}
        >
          <i className="fas fa-trash" />
        </button>
      </div>
    </div>
  );
};

export default ClanSelect;