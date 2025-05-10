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

  const exemptRoutes = ["item", "api", "assets"];

  useEffect(() => {
    // Extract the first segment of the path to check if it's a language code
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    // Only redirect if the path doesn't start with a valid language code
    // and is not a special path that should be accessible without language prefix
    if (!firstSegment) {
      // Empty path, redirect to default language
      const currentLang = i18n.language?.split("-")[0] || DEFAULT_LANGUAGE;
      navigate(`/${currentLang}`, { replace: true });
    } else if (
      !supportedLangCodes.includes(firstSegment) &&
      !exemptRoutes.includes(firstSegment)
    ) {
      // Path starts with something that is not a language code and not an exempt route
      // Add language prefix
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
      {/* Routes exempt from language prefix */}
      {exemptRoutes.map((route) => (
        <Route key={route} path={`/${route}/*`} element={children} />
      ))}
      {/* Redirect route for URLs without language prefix */}
      <Route path="*" element={null} />
    </Routes>
  );
};

export default LanguageRouter;
