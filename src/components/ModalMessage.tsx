"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { sendEvent } from "@/lib/page-tracking";

interface Message {
  text: string;
  isError?: boolean;
  redirectPage?: string;
}

interface ModalMessageProps {
  message: Message;
  onClickOk?: () => void;
}

export default function ModalMessage({
  message,
  onClickOk,
}: ModalMessageProps) {
  const [redirect, setRedirect] = useState(false);
  const t = useTranslations();
  const router = useRouter();

  const handleRedirect = () => {
    if (message.redirectPage) {
      setRedirect(true);
      router.push(message.redirectPage);
    }
  };

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

  if (message.text === "Error when connecting to the API") {
    localStorage.removeItem("allItems");
    sessionStorage.removeItem("allItems");
    if (typeof window !== "undefined" && "caches" in window) {
      window.caches.keys().then((names) => {
        for (const name of names) {
          if (name.includes("lastCheck")) {
            window.caches?.delete(name);
          }
        }
      });
    }
  }

  if (redirect) {
    return null;
  }

  sendEvent("modal", {
    props: {
      action: message.isError ? "Error" : "Information",
      label: message.text,
    },
  });

  return (
    <div className="modal d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modal">
              {message.isError ? t("Error") : t("Information")}
            </h5>
          </div>
          <div className="modal-body">{t(message.text)}</div>
          <div className="modal-footer">
            {message.redirectPage == null ? <OkButton /> : <RedirectButton />}
          </div>
        </div>
      </div>
    </div>
  );
}
