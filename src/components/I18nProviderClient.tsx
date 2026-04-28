"use client";

import type React from "react";
import { useMemo } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { createInstance } from "i18next";

type I18nNamespaces = Record<string, Record<string, unknown>>;

type I18nProviderClientProps = {
  lang: string;
  namespaces: I18nNamespaces;
  children: React.ReactNode;
};

export default function I18nProviderClient({
  lang,
  namespaces,
  children,
}: I18nProviderClientProps) {
  const i18n = useMemo(() => {
    const instance = createInstance();
    instance.use(initReactI18next).init(
      {
        lng: lang,
        fallbackLng: "en",
        resources: {
          [lang]: namespaces,
        },
        ns: Object.keys(namespaces),
        defaultNS: "translation",
        interpolation: { escapeValue: false },
        initImmediate: false,
        react: { useSuspense: false },
      } as never,
    );
    return instance;
  }, [lang, namespaces]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
