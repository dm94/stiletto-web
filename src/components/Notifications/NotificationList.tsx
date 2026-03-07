import type React from "react";
import { useState, useEffect, useMemo } from "react";
import Notifications from "./Notifications";

interface Notification {
  date: number;
  message: string;
  type?: string;
}

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const channel = useMemo(() => new BroadcastChannel("notifications"), []);

  useEffect(() => {
    channel.onmessage = (e) => {
      setNotifications((prevNotifications) => [...prevNotifications, e.data]);
    };

    return () => {
      channel.close();
    };
  }, [channel]);

  useEffect(() => {
    const interval = setInterval(() => {
      const minTime = Date.now() - 5000;
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.date >= minTime,
        ),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
