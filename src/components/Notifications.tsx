"use client";

import { useTranslations } from "next-intl";

interface Notification {
  type: string;
  message: string;
  date: string;
}

interface NotificationsProps {
  notifications?: Notification[];
  close?: (date: string) => void;
}

export default function Notifications({
  notifications,
  close,
}: NotificationsProps) {
  const t = useTranslations();

  const renderNotifications = () => {
    if (!notifications?.length) {
      return null;
    }

    return notifications.map((data) => (
      <div
        className="toast show"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        key={`notification-${data.date}`}
      >
        <div className="toast-header">
          <strong className="me-auto">{t(data.type)}</strong>
          <button
            type="button"
            className="btn-close"
            aria-label={t("Close")}
            onClick={() => close?.(data.date)}
          />
        </div>
        <div className="toast-body">{t(data.message)}</div>
      </div>
    ));
  };

  return <div className="notifications">{renderNotifications()}</div>;
}
