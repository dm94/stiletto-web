import React from "react";
import { useTranslation } from "react-i18next";

const Notifications = ({ notifications, close }) => {
  const { t } = useTranslation();

  const renderNotifications = () => {
    if (!notifications) {
      return "";
    }

    return notifications.map((data) => (
      <div
        className="bg-white rounded-lg shadow-md mb-3 overflow-hidden"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        key={`notification-${data.date}`}
      >
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
          <strong className="font-medium">{t(data.type)}</strong>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Close"
            onClick={() => close?.(data.date)}
          >
            <span aria-hidden="true" className="text-xl">&times;</span>
          </button>
        </div>
        <div className="px-4 py-3">{t(data.message)}</div>
      </div>
    ));
  };

  return <div className="fixed top-4 right-4 z-50 max-w-sm">{renderNotifications()}</div>;
};

export default Notifications;
