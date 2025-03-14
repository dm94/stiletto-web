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
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        onClick={() => onShowRequest(member)}
      >
        {t("Show request")}
      </button>
    );
  };

  return (
    <tr className="hover:bg-gray-700 transition-colors duration-150">
      <td className="px-4 py-3">
        <span className="font-medium text-neutral-400">
          {member?.discordtag}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-300">{member?.nickname}</td>
      <td className="px-4 py-3">{renderButton()}</td>
    </tr>
  );
};

export default RequestMemberListItem;
