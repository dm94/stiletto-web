import type React from "react";
import { Link, type LinkProps } from "react-router";
import { useLocation } from "react-router";
import i18n from "i18next";
import { DEFAULT_LANGUAGE } from "@config/config";
import { supportedLanguages } from "@config/languages";

/**
 * Component that extends the standard Link to maintain the language prefix in routes
 * Ensures that all navigations maintain the selected language
 */
const LanguageLink: React.FC<LinkProps> = ({ to, children, ...props }) => {
  const location = useLocation();
  const supportedLangCodes = supportedLanguages.map((lang) => lang.key);

  // Get the current language, either from the URL or from the i18n state
  const getCurrentLanguage = (): string => {
    // Try to extract the language from the current URL
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    if (firstSegment && supportedLangCodes.includes(firstSegment)) {
      return firstSegment;
    }

    // If not in the URL, use the language from i18n
    return i18n.language?.split("-")[0] || DEFAULT_LANGUAGE;
  };

  // Build the path with the language prefix
  const getLanguagePrefixedPath = (path: string): string => {
    const currentLang = getCurrentLanguage();

    // If the path already starts with a valid language code, don't modify it
    const pathWithoutLeadingSlash = path.startsWith("/")
      ? path.substring(1)
      : path;
    const segments = pathWithoutLeadingSlash.split("/");

    if (segments[0] && supportedLangCodes.includes(segments[0])) {
      return path;
    }

    // Add the language prefix to the path
    return `/${currentLang}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // Create the new route with language prefix
  const newTo =
    typeof to === "string"
      ? getLanguagePrefixedPath(to)
      : { ...to, pathname: getLanguagePrefixedPath(to.pathname || "/") };

  return (
    <Link to={newTo} {...props}>
      {children}
    </Link>
  );
};

export default LanguageLink;
