import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { getStoredItem } from "../services";

class ChangeLanguageModal extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">{t("Change language")}</div>
            <div className="modal-body">
              <div className="row text-center">
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/es.jpg"
                    alt="Spanish language"
                    onClick={() => this.props.switchLanguage("es")}
                  />
                  <p>{t("Spanish")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/en.jpg"
                    alt="English language"
                    onClick={() => this.props.switchLanguage("en")}
                  />
                  <p>{t("English")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/ru.jpg"
                    alt="Russian language"
                    onClick={() => this.props.switchLanguage("ru")}
                  />
                  <p>{t("Russian")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/fr.jpg"
                    alt="French language"
                    onClick={() => this.props.switchLanguage("fr")}
                  />
                  <p>{t("French")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/de.jpg"
                    alt="German language"
                    onClick={() => this.props.switchLanguage("de")}
                  />
                  <p>{t("German")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/zh.jpg"
                    alt="Chinese Simplified language"
                    onClick={() => this.props.switchLanguage("zh")}
                  />
                  <p>{t("Chinese Simplified")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/it.jpg"
                    alt="Italian language"
                    onClick={() => this.props.switchLanguage("it")}
                  />
                  <p>{t("Italian")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/ja.jpg"
                    alt="Japanese language"
                    onClick={() => this.props.switchLanguage("ja")}
                  />
                  <p>{t("Japanese")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/pl.jpg"
                    alt="Polish language"
                    onClick={() => this.props.switchLanguage("pl")}
                  />
                  <p>{t("Polish")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/pt.jpg"
                    alt="Portuguese language"
                    onClick={() => this.props.switchLanguage("pt")}
                  />
                  <p>{t("Portuguese, Brazilian")}</p>
                </div>
                <div className="col-3">
                  <img
                    className="img-thumbnail"
                    src="/img/uk.jpg"
                    alt="Ukrainian language"
                    onClick={() => this.props.switchLanguage("uk")}
                  />
                  <p>{t("Ukrainian")}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <p className="mr-auto">v4.4.3</p>
              <button
                className={
                  getStoredItem("darkmode") !== "true"
                    ? "btn btn-outline-secondary"
                    : "btn btn-outline-light"
                }
                onClick={() => {
                  this.props.hideModal();
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
