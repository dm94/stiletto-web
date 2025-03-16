import React from "react";
import { useTranslation } from "react-i18next";

const CookieConsent = () => {
  const { t } = useTranslation();

  if (!localStorage.getItem("acceptscookies")) {
    return (
      <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="mr-4">
          {t("common.cookiesNotice")}
        </div>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={() => {
            localStorage.setItem("acceptscookies", true);
            window.location.reload();
          }}
        >
          {t("common.accept")}
        </button>
      </div>
    );
  }

  return "";
};

export default CookieConsent;
