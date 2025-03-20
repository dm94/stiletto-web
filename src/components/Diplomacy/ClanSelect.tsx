import type React from "react";
import ClanName from "../ClanName";
import type { RelationshipInfo } from "../../types/dto/relationship";

interface ClanSelectProps {
  isLeader: boolean;
  clan: RelationshipInfo;
  onDelete: (id: number) => void;
}

const ClanSelect: React.FC<ClanSelectProps> = ({ isLeader, clan, onDelete }) => {

  return (
    <div
      className="flex items-center"
    >
      <div className="flex-grow">
        <ClanName clan={clan} />
      </div>
      <div className={isLeader ? "ml-2" : "hidden"}>
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
