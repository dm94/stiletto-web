"use client";

import type React from "react";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../utils/i18n-client";
import { getStoredItem } from "../functions/services";

interface I18nProviderProps {
  children: React.ReactNode;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize language from localStorage on client side
    const storedLanguage = getStoredItem("i18nextLng");
    if (storedLanguage && i18n.language !== storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
