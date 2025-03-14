import React from "react";
import { useTranslation } from "react-i18next";
import { isDarkMode } from "../functions/utils";
import { supportedLanguages } from "../config/languages";

const ChangeLanguageModal = ({ switchLanguage, hideModal }) => {
  const { t } = useTranslation();

  const renderLanguageButtons = () => {
    return supportedLanguages.map((language) => (
      <button
        type="button"
        className="col-3"
        key={language.key}
        onClick={() => switchLanguage?.(language.key)}
      >
        <img
          className="img-thumbnail"
          src={`/img/${language.key}.jpg`}
          alt={`${language.name} language`}
        />
        <p>{t(language.name)}</p>
      </button>
    ));
  };

  return (
    <div className="modal d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">{t("Change language")}</div>
          <div className="modal-body">
            <div className="row text-center">{renderLanguageButtons()}</div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className={
                isDarkMode()
                  ? "btn btn-outline-light"
                  : "btn btn-outline-secondary"
              }
              onClick={() => hideModal?.()}
            >
              {t("Accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeLanguageModal;
