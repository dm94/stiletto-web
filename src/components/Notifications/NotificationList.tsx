import React, { useState, useEffect } from "react";
import Notifications from "./Notifications";

interface Notification {
  date: number;
  message: string;
  type?: string;
}

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const channel = new BroadcastChannel("notifications");
  const [seconds, setSeconds] = useState<number>(0);

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
      checkOldNotifications();
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkOldNotifications = (): void => {
    const minTime = Date.now() - 5000;
    for (const data of notifications) {
      if (data.date < minTime) {
        deleteNotification(data.date);
      }
    }
  };

  const deleteNotification = (id: number): void => {
    setNotifications(notifications.filter((data) => data.date !== id));
  };

  return (
    <Notifications
      notifications={notifications}
      close={(id: number) => deleteNotification(id)}
    />
  );
};

export default NotificationList;