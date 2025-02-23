import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sendEvent } from "../page-tracking";

const ModalMessage = ({ message, onClickOk }) => {
  const [redirect, setRedirect] = useState(false);
  const { t } = useTranslation();

  const handleRedirect = () => setRedirect(true);

  const RedirectButton = () => (
    <button
      type="button"
      className="btn btn-lg btn-outline-warning btn-block"
      onClick={handleRedirect}
    >
      OK
    </button>
  );

  const OkButton = () => (
    <button
      type="button"
      className="btn btn-lg btn-outline-warning btn-block"
      onClick={() => onClickOk?.()}
    >
      OK
    </button>
  );

  if (message?.text === "Error when connecting to the API") {
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
    return <Redirect to={message?.redirectPage} />;
  }

  sendEvent("modal", {
    props: {
      action: message?.isError ? "Error" : "Information",
      label: message?.text,
    },
  });

  return (
    <div className="modal d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modal">
              {message?.isError ? t("Error") : t("Information")}
            </h5>
          </div>
          <div className="modal-body">{t(message?.text)}</div>
          <div className="modal-footer">
            {message?.redirectPage == null ? <OkButton /> : <RedirectButton />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMessage;
