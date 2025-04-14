"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const NextCookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [showConsent, setShowConsent] = useState<boolean>(false);

  useEffect(() => {
    // Check if cookies are accepted in client-side only
    const acceptsCookies = localStorage.getItem("acceptscookies");
    setShowConsent(!acceptsCookies);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("acceptscookies", "true");
    setShowConsent(false);
    window.location.reload();
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-800 text-white p-4 flex items-center justify-between z-50">
      <div className="mr-4">{t("common.cookiesNotice")}</div>
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        onClick={acceptCookies}
      >
        {t("common.accept")}
      </button>
    </div>
  );
};

export default NextCookieConsent;
