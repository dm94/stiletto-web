"use client";

import type React from "react";
import { useState } from "react";
import { getStoredItem } from "@/lib/storage";
import { useTranslations } from "next-intl";

interface Settings {
  language: string;
  darkMode: boolean;
  acceptsCookies: boolean;
  notifications: boolean;
}

export default function SettingsPage() {
  const t = useTranslations();

  const [settings, setSettings] = useState<Settings>({
    language: getStoredItem("i18nextLng") || "en",
    darkMode: getStoredItem("darkmode") === "true",
    acceptsCookies: getStoredItem("acceptscookies") === "true",
    notifications: getStoredItem("notifications") === "true",
  });

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSettings((prev) => ({ ...prev, language: newLanguage }));
    // i18n.changeLanguage(newLanguage);
    localStorage.setItem("i18nextLng", newLanguage);
  };

  const handleDarkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDarkMode = e.target.checked;
    setSettings((prev) => ({ ...prev, darkMode: isDarkMode }));
    localStorage.setItem("darkmode", isDarkMode.toString());
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  };

  const handleCookiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const acceptsCookies = e.target.checked;
    setSettings((prev) => ({ ...prev, acceptsCookies }));
    localStorage.setItem("acceptscookies", acceptsCookies.toString());
  };

  const handleNotificationsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const enableNotifications = e.target.checked;
    setSettings((prev) => ({ ...prev, notifications: enableNotifications }));
    localStorage.setItem("notifications", enableNotifications.toString());
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title h5 mb-0">{t("Settings")}</h1>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <label htmlFor="language" className="form-label">
                  {t("Language")}
                </label>
                <select
                  id="language"
                  className="form-select"
                  value={settings.language}
                  onChange={handleLanguageChange}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                  <option value="ru">Русский</option>
                  <option value="zh">中文</option>
                </select>
              </div>

              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="darkMode"
                    checked={settings.darkMode}
                    onChange={handleDarkModeChange}
                  />
                  <label className="form-check-label" htmlFor="darkMode">
                    {t("Dark Mode")}
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="cookies"
                    checked={settings.acceptsCookies}
                    onChange={handleCookiesChange}
                  />
                  <label className="form-check-label" htmlFor="cookies">
                    {t("Accept Cookies")}
                  </label>
                </div>
                <small className="text-muted d-block mt-1">
                  {t(
                    "Cookies help us provide better features and improve your experience."
                  )}
                </small>
              </div>

              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="notifications"
                    checked={settings.notifications}
                    onChange={handleNotificationsChange}
                  />
                  <label className="form-check-label" htmlFor="notifications">
                    {t("Enable Notifications")}
                  </label>
                </div>
                <small className="text-muted d-block mt-1">
                  {t(
                    "Receive notifications about important updates and events."
                  )}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
