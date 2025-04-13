"use client";

import { useCallback } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supportedLanguages } from "../config/languages";
import type { Dictionary } from "../lib/i18n";
import { useClientTranslation } from "../lib/client-i18n";

interface LanguageSwitcherProps {
  dictionary: Dictionary;
  currentLocale: string;
}

export default function LanguageSwitcher({
  dictionary,
  currentLocale,
}: Readonly<LanguageSwitcherProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useClientTranslation(dictionary);

  const switchLanguage = useCallback(
    (locale: string) => {
      // Set cookie
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`; // 1 year

      // Get the path without the locale
      const pathWithoutLocale = pathname?.split("/").slice(2).join("/");

      // Navigate to the new locale path
      router.push(`/${locale}/${pathWithoutLocale}`);
    },
    [pathname, router],
  );

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold mb-4">
        {t("settings.changeLanguage")}
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {supportedLanguages.map((language) => (
          <button
            type="button"
            key={language.key}
            onClick={() => switchLanguage(language.key)}
            className={`flex flex-col items-center p-2 rounded ${currentLocale === language.key ? "bg-blue-100 dark:bg-blue-900" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <div className="relative w-12 h-8 mb-2 overflow-hidden rounded">
              <Image
                src={`/img/${language.key}.jpg`}
                alt={`${t(language.name)} language`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <span className="text-sm">{t(language.name)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
