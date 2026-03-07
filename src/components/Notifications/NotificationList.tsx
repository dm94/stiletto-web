import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import Notifications from "./Notifications";

interface Notification {
  date: number;
  message: string;
  type?: string;
}

const NOTIFICATION_TTL_MS = 5000;
const CLEANUP_INTERVAL_MS = 1000;

const getRecentNotifications = (
  currentNotifications: Notification[],
  minTime: number,
): Notification[] => {
  return currentNotifications.filter(
    (notification) => notification.date >= minTime,
  );
};

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const channel = useMemo(() => new BroadcastChannel("notifications"), []);
  const removeExpiredNotifications = useCallback((): void => {
    const minTime = Date.now() - NOTIFICATION_TTL_MS;
    setNotifications((prevNotifications) =>
      getRecentNotifications(prevNotifications, minTime),
    );
  }, []);

  useEffect(() => {
    channel.onmessage = (e) => {
      setNotifications((prevNotifications) => [...prevNotifications, e.data]);
    };

    return () => {
      channel.onmessage = null;
      channel.close();
    };
  }, [channel]);

  useEffect(() => {
    const interval = setInterval(
      removeExpiredNotifications,
      CLEANUP_INTERVAL_MS,
    );

    return () => clearInterval(interval);
  }, [removeExpiredNotifications]);

  const deleteNotification = (id: number): void => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((data) => data.date !== id),
    );
  };

  return (
    <Notifications
      notifications={notifications}
      close={(id: number) => deleteNotification(id)}
    />
  );
};

export default NotificationList;
