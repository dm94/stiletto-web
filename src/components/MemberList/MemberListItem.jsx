import React from "react";
import { useTranslation } from "react-i18next";
import { getStoredItem } from "../../services";

const MemberListItem = ({
  member,
  isLeader,
  hasPermissions,
  onKick,
  onClickEditPermissions,
}) => {
  const { t } = useTranslation();

  const renderKickButton = () => {
    if (!isLeader && !hasPermissions) {
      return false;
    }

    if (
      member.discordid === getStoredItem("discordid") ||
      member.discordid === member.leaderid
    ) {
      return false;
    }

    return (
      <td>
        <button
          type="button"
          className="btn btn-block btn-danger"
          onClick={() => onKick(member.discordid)}
        >
          {t("Kick")}
        </button>
      </td>
    );
  };

  const renderEditPermissionsButton = () => {
    if (!isLeader) {
      return false;
    }

    if (
      member.discordid === getStoredItem("discordid") ||
      member.discordid === member.leaderid
    ) {
      return false;
    }

    return (
      <td className="text-center">
        <div className="btn-group" role="group">
          <button type="button" className="btn btn-primary" disabled>
            <i className="fas fa-user-cog" />
          </button>
          <button
            type="button"
            className="btn btn-block btn-info"
            onClick={() => onClickEditPermissions(member.discordid)}
          >
            {t("Edit")}
          </button>
        </div>
      </td>
    );
  };

  return (
    <tr>
      <td className="text-center">
        {member.leaderid === member.discordid && (
          <i className="fas fa-crown text-warning" />
        )}{" "}
        {member.discordtag}
      </td>
      <td className="text-center">{member.nickname}</td>
      {renderKickButton()}
      {renderEditPermissionsButton()}
    </tr>
  );
};

export default MemberListItem;
