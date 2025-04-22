import type React from "react";
import { useTranslation } from "react-i18next";
import type { MemberInfo } from "../../types/dto/members";
import { useUser } from "../../store";

interface MemberListItemProps {
  member: MemberInfo;
  isLeader: boolean;
  hasPermissions: boolean;
  onKick: (discordId: string) => void;
  onClickEditPermissions: (discordId: string) => void;
}

const MemberListItem: React.FC<MemberListItemProps> = ({
  member,
  isLeader,
  hasPermissions,
  onKick,
  onClickEditPermissions,
}) => {
  const { t } = useTranslation();
  const { discordId } = useUser();

  const renderKickButton = (): React.ReactNode => {
    if (!isLeader && !hasPermissions) {
      return null;
    }

    if (
      member.discordid === discordId ||
      member.discordid === member.leaderid
    ) {
      return null;
    }

    return (
      <td className="px-4 py-3">
        <button
          type="button"
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          onClick={() => onKick(member.discordid)}
        >
          {t("members.kick")}
        </button>
      </td>
    );
  };

  const renderEditPermissionsButton = (): React.ReactNode => {
    if (!isLeader) {
      return null;
    }

    if (
      member.discordid === discordId ||
      member.discordid === member.leaderid
    ) {
      return null;
    }

    return (
      <td className="px-4 py-3">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className="px-2 py-1 bg-blue-600 text-white rounded-l-lg flex items-center justify-center"
            disabled
          >
            <i className="fas fa-user-cog" />
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onClick={() => onClickEditPermissions(member.discordid)}
          >
            {t("common.edit")}
          </button>
        </div>
      </td>
    );
  };

  return (
    <tr className="hover:bg-gray-700 transition-colors duration-150">
      <td className="px-4 py-3">
        {member.leaderid === member.discordid && (
          <i className="fas fa-crown text-yellow-400 mr-1" />
        )}
        <span className="font-medium text-neutral-400">
          {member.discordtag}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-300">{member.nickname}</td>
      {renderKickButton()}
      {renderEditPermissionsButton()}
    </tr>
  );
};

export default MemberListItem;
