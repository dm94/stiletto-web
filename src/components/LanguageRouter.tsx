import type React from "react";
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router";
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
    // Preserve query parameters during redirects
    const queryParams = location.search ?? "";

    if (!firstSegment) {
      navigate(`/${DEFAULT_LANGUAGE}${queryParams}`, { replace: true });
    } else if (!supportedLangCodes.includes(firstSegment)) {
      const remainingPath =
        pathSegments.length > 1 ? `/${pathSegments.slice(1).join("/")}` : "";
      const newPath = `/${DEFAULT_LANGUAGE}${remainingPath}${queryParams}`;
      navigate(newPath, { replace: true });
    }
  }, [location, navigate, supportedLangCodes]);

  return (
    <Routes>
      {supportedLangCodes.map((langCode) => (
        <Route key={langCode} path={`/${langCode}/*`} element={children} />
      ))}
      <Route path="*" element={children} />
    </Routes>
  );
};

export default LanguageRouter;
