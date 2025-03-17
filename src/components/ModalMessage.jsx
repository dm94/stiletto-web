import React, { useState } from "react";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { sendEvent } from "../page-tracking";

const ModalMessage = ({ message, onClickOk }) => {
  const [redirect, setRedirect] = useState(false);
  const { t } = useTranslation();

  const handleRedirect = () => setRedirect(true);

  const RedirectButton = () => (
    <button
      type="button"
      className="w-full px-4 py-2 text-sm font-medium text-yellow-500 border border-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      onClick={handleRedirect}
    >
      OK
    </button>
  );

  const OkButton = () => (
    <button
      type="button"
      className="w-full px-4 py-2 text-sm font-medium text-yellow-500 border border-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      onClick={() => onClickOk?.()}
    >
      OK
    </button>
  );

  if (message?.text === "errors.apiConnection") {
    localStorage.removeItem("allItems");
    sessionStorage.removeItem("allItems");
    if (window?.caches) {
      window.caches.keys().then((names) => {
        for (const name of names) {
          if (name.includes("lastCheck")) {
            caches?.delete(name);
          }
        }
      });
    }
  }

  if (redirect) {
    return <Navigate to={message?.redirectPage} replace />;
  }

  sendEvent("modal", {
    props: {
      action: message?.isError ? "Error" : "Information",
      label: message?.text,
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b border-gray-700">
          <h5 className="text-xl font-semibold text-white" id="modal">
            {message?.isError ? t("common.error") : t("common.information")}
          </h5>
        </div>
        <div className="p-4 text-gray-300">{t(message?.text)}</div>
        <div className="p-4 border-t border-gray-700">
          {message?.redirectPage == null ? <OkButton /> : <RedirectButton />}
        </div>
      </div>
    </div>
  );
};

export default ModalMessage;
