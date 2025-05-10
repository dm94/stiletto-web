import type React from "react";
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router";
import i18n from "i18next";
import { supportedLanguages } from "@config/languages";
import { DEFAULT_LANGUAGE } from "@config/config";

interface LanguageRouterProps {
  children: React.ReactNode;
}

/**
 * Component that handles language-based routing
 * Detects the language from the URL and configures i18n accordingly
 */
const LanguageRouter: React.FC<LanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const supportedLangCodes = supportedLanguages.map((lang) => lang.key);

  useEffect(() => {
    // Extract the first segment of the path to check if it's a language code
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    // If the URL doesn't have a valid language code, redirect to the URL with the current language
    if (!firstSegment || !supportedLangCodes.includes(firstSegment)) {
      const currentLang = i18n.language?.split("-")[0] || DEFAULT_LANGUAGE;
      const newPath = `/${currentLang}${location.pathname}`;
      navigate(newPath, { replace: true });
    }
  }, [location, navigate, supportedLangCodes]);

  return (
    <Routes>
      {/* Routes with language prefix */}
      {supportedLangCodes.map((langCode) => (
        <Route key={langCode} path={`/${langCode}/*`} element={children} />
      ))}
      {/* Redirect route for URLs without language prefix */}
      <Route path="*" element={null} />
    </Routes>
  );
};

export default LanguageRouter;
