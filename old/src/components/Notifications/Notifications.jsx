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
        className="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        key={`notification-${data.date}`}
      >
        <div className="toast-header">
          <strong className="mr-auto">{t(data.type)}</strong>
          <button
            type="button"
            className="ml-2 mb-1 close"
            aria-label="Close"
            onClick={() => close?.(data.date)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="toast-body">{t(data.message)}</div>
      </div>
    ));
  };

  return <div className="notifications">{renderNotifications()}</div>;
};

export default Notifications;
