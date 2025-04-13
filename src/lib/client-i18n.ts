"use client";

import { useState, useEffect } from "react";
import type { Dictionary } from "./i18n";

const DEFAULT_LOCALE = "en";

// Client-side hook for translations
export function useClientTranslation(dictionary: Dictionary) {
  const [locale, setLocale] = useState<string>(DEFAULT_LOCALE);

  useEffect(() => {
    // Get the locale from the URL or cookie
    const pathLocale = window.location.pathname.split("/")[1];
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];

    setLocale(pathLocale ?? cookieLocale ?? DEFAULT_LOCALE);
  }, []);

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split(".");
    let value: any = dictionary;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if the translation is not found
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // Replace parameters in the translation
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{{${paramKey}}}`, "g"), paramValue);
      }, value);
    }

    return value;
  };

  // Function to change the locale
  const changeLocale = (newLocale: string) => {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year

    // Redirect to the new locale
    const currentPath = window.location.pathname.split("/").slice(2).join("/");
    window.location.href = `/${newLocale}/${currentPath}${window.location.search}`;
  };

  return { t, locale, changeLocale };
}
