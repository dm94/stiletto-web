import React, { useState, useEffect } from "react";
import Notifications from "./Notifications";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const channel = new BroadcastChannel("notifications");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    channel.onmessage = (e) => {
      setNotifications(notifications.concat([e.data]));
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
  }, [seconds]);

  const checkOldNotifications = () => {
    const minTime = Date.now() - 5000;
    notifications.forEach((data) => {
      if (data.date < minTime) {
        deleteNotification(data.date);
      }
    });
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((data) => data.date != id));
  };

  return (
    <Notifications
      notifications={notifications}
      close={(id) => deleteNotification(id)}
    />
  );
};

export default NotificationList;
