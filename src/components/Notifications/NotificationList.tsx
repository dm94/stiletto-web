"use client";

import { useState, useEffect, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
}

export default function NotificationList(): ReactElement | null {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const t = useTranslations();

  useEffect(() => {
    // Aquí podrías cargar las notificaciones desde una API o localStorage
    // Por ahora, solo mostraremos una notificación de ejemplo si es la primera visita
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      addNotification({
        id: "welcome",
        title: t("Welcome"),
        message: t(
          "Welcome to Stiletto Web! This is a utility website for Last Oasis."
        ),
        type: "info",
        timestamp: new Date(),
      });
      localStorage.setItem("hasVisited", "true");
    }
  }, [t]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!notifications.length) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm animate-slide-in ${
            notification.type === "error"
              ? "bg-red-500 text-white"
              : notification.type === "warning"
              ? "bg-yellow-500 text-black"
              : notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{notification.title}</h4>
            <button
              type="button"
              onClick={() => removeNotification(notification.id)}
              className="text-current opacity-75 hover:opacity-100"
              aria-label={t("Close")}
            >
              ×
            </button>
          </div>
          <p className="mt-1 text-sm">{notification.message}</p>
          <p className="mt-2 text-xs opacity-75">
            {formatDate(notification.timestamp)}
          </p>
        </div>
      ))}
    </div>
  );
}
