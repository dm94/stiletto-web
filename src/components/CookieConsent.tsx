"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function CookieConsent() {
  const t = useTranslations();
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowConsent(!localStorage.getItem("acceptscookies"));
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("acceptscookies", "true");
    setShowConsent(false);
    window.location.reload();
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed-bottom w-100 mw-100 bg-dark text-white p-3 d-flex">
      <div className="mr-auto my-auto">
        {t("This website uses cookies to enhance the user experience")}
      </div>
      <button type="button" className="btn btn-success" onClick={handleAccept}>
        {t("Accept")}
      </button>
    </div>
  );
}
