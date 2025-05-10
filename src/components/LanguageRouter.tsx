import type React from "react";
import { Routes, Route } from "react-router";
import { supportedLanguages } from "@config/languages";

interface LanguageRouterProps {
  children: React.ReactNode;
}

/**
 * Component that handles language-based routing
 * Detects the language from the URL and configures i18n accordingly
 */
const LanguageRouter: React.FC<LanguageRouterProps> = ({ children }) => {
  const supportedLangCodes = supportedLanguages.map((lang) => lang.key);

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
