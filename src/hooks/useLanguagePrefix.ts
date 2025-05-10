import { useLocation } from "react-router";
import i18n from "i18next";
import { DEFAULT_LANGUAGE } from "@config/config";
import { supportedLanguages } from "@config/languages";

/**
 * Custom hook that provides language prefix functionality for routes
 * Extracts the current language from URL or i18n state and handles path prefixing
 */
export const useLanguagePrefix = () => {
  const location = useLocation();
  const supportedLangCodes = supportedLanguages.map((lang) => lang.key);

  /**
   * Gets the current language from URL or i18n state
   * @returns The current language code
   */
  const getCurrentLanguage = (): string => {
    // Try to extract the language from the current URL
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    if (firstSegment && supportedLangCodes.includes(firstSegment)) {
      return firstSegment;
    }

    // If not in the URL, use the language from i18n
    return i18n.language?.split("-")[0] ?? DEFAULT_LANGUAGE;
  };

  /**
   * Adds language prefix to a path if needed
   * @param path The path to prefix
   * @returns The path with language prefix
   */
  const getLanguagePrefixedPath = (path: string): string => {
    const currentLang = getCurrentLanguage();

    // If the path already starts with a valid language code, don't modify it
    const pathWithoutLeadingSlash = path.startsWith("/")
      ? path.substring(1)
      : path;
    const segments = pathWithoutLeadingSlash.split("/");

    // If the first segment is a valid language code, do not modify the route
    if (segments[0] && supportedLangCodes.includes(segments[0])) {
      return path;
    }

    // Add the language prefix to the path
    const pathWithPrefix = path.startsWith("/") ? path : `/${path}`;
    return `/${currentLang}${pathWithPrefix}`;
  };

  return { getLanguagePrefixedPath, getCurrentLanguage };
};
