import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { isDarkMode } from "../functions/utils";

class ChangeLanguageModal extends Component {
  getLanguajes = () => {
    const supportedLanguages = [
      { key: "en", name: "English" },
      { key: "es", name: "Spanish" },
      { key: "ru", name: "Russian" },
      { key: "fr", name: "French" },
      { key: "de", name: "German" },
      { key: "it", name: "Italian" },
      { key: "ja", name: "Japanese" },
      { key: "pl", name: "Polish" },
      { key: "zh", name: "Chinese Simplified" },
      { key: "pt", name: "Portuguese, Brazilian" },
      { key: "uk", name: "Ukrainian" },
    ];

    return supportedLanguages.map((languaje) => {
      const { t } = this.props;
      return (
        <button
          type="button"
          className="col-3"
          key={languaje.key}
          onClick={() => this.props?.switchLanguage(languaje.key)}
        >
          <img
            className="img-thumbnail"
            src={`/img/${languaje.key}.jpg`}
            alt={`${languaje.name} language`}
          />
          <p>{t(languaje.name)}</p>
        </button>
      );
    });
  };

  render() {
    const { t } = this.props;
    return (
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">{t("Change language")}</div>
            <div className="modal-body">
              <div className="row text-center">{this.getLanguajes()}</div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={
                  isDarkMode()
                    ? "btn btn-outline-light"
                    : "btn btn-outline-secondary"
                }
                onClick={() => {
                  this.props?.hideModal();
                }}
              >
                {t("Accept")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ChangeLanguageModal);
