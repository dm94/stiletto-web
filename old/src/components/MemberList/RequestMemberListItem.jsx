import React from "react";
import { useTranslation } from "react-i18next";

const RequestMemberListItem = ({ isLeader, member, onShowRequest }) => {
  const { t } = useTranslation();

  const renderButton = () => {
    if (!isLeader) {
      return "";
    }

    return (
      <button
        type="button"
        className="btn btn-block btn-primary"
        onClick={() => onShowRequest(member)}
      >
        {t("Show request")}
      </button>
    );
  };

  return (
    <tr>
      <td className="text-center">{member?.discordtag}</td>
      <td className="text-center">{member?.nickname}</td>
      <td>{renderButton()}</td>
    </tr>
  );
};

export default RequestMemberListItem;
