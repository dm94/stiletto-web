import type React from "react";
import { memo } from "react";
import { FaTrash } from "react-icons/fa";
import ClanName from "../ClanName";
import type { RelationshipInfo } from "@ctypes/dto/relationship";

interface ClanSelectProps {
  isLeader: boolean;
  clan: RelationshipInfo;
  onDelete: (id: number) => void;
}

const ClanSelect: React.FC<ClanSelectProps> = ({
  isLeader,
  clan,
  onDelete,
}) => {
  return (
    <div className="flex items-center">
      <div className="flex-grow">
        <ClanName clan={clan} />
      </div>
      <div className={isLeader ? "ml-2" : "hidden"}>
        <button
          type="button"
          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => onDelete(clan?.id)}
          aria-label="Delete relationship"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default memo(ClanSelect);
