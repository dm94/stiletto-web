import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class CookieConsent extends Component {
  state = {};
  render() {
    const { t } = this.props;
    if (!localStorage.getItem("acceptscookies")) {
      return (
        <div className="fixed-bottom w-100 mw-100 bg-dark text-white p-3 d-flex">
          <div className="mr-auto my-auto">
            {t("This website uses cookies to enhance the user experience.")}
          </div>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              localStorage.setItem("acceptscookies", true);
              window.location.reload();
            }}
          >
            {t("Accept")}
          </button>
        </div>
      );
    } else {
      return "";
    }
  }
}

export default withTranslation()(CookieConsent);
