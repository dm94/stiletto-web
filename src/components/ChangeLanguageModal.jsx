import React from "react";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../config/languages";

const ChangeLanguageModal = ({ switchLanguage, hideModal }) => {
  const { t } = useTranslation();

  const renderLanguageButtons = () => {
    return supportedLanguages.map((language) => (
      <button
        type="button"
        className="p-2 text-center"
        key={language.key}
        onClick={() => switchLanguage?.(language.key)}
      >
        <img
          className="w-full rounded-lg border-2 border-gray-600 hover:border-blue-500 transition-colors"
          src={`/img/${language.key}.jpg`}
          alt={`${language.name} language`}
        />
        <p className="mt-2 text-sm text-gray-300">{t(language.name)}</p>
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {t("Change language")}
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {renderLanguageButtons()}
          </div>
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => hideModal?.()}
          >
            {t("Accept")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeLanguageModal;
