import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class Privacy extends Component {
  state = {};
  render() {
    const { t } = this.props;
    return (
      <div className="row">
        <div className="col-12">
          <h2 className="mb-0 pb-2 text-center">{t("Privacy Policy")}</h2>
        </div>
        <div className="col-12 border rounded p-4 mb-2">
          <h3>{t("What information do we collect?")}</h3>
          <p>
            {t(
              "Cookies - This site only uses Google cookies to view web traffic."
            )}
          </p>
          <p>
            {t(
              "Events - We use google to analyse some events in order to use them to improve the website."
            )}
          </p>
          <p>
            {t(
              "Private data - The only registration data saved is Discord ID and Discord Tag."
            )}
          </p>
        </div>
        <div className="col-12 border rounded p-4 mb-2">
          <h3>{t("What do we use this data for?")}</h3>
          <p>{t("To improve the web experience.")}</p>
          <p>
            {t(
              "To provide some functions such as clan management and map management."
            )}
          </p>
        </div>
        <div className="col-12 border rounded p-4 mb-2">
          <p>
            {t(
              "Your Discord Tag and Discord ID can be displayed on our website for different functions such as trading or clan functions."
            )}
          </p>
          <p>
            {t(
              "Data added to the website such as diplomacy, map resources or clan members are stored in a database and the necessary security measures are taken so that no one can access these data."
            )}
          </p>
          <p>
            {t(
              "Source Code is published on GitHub for full disclosure where you can also report any issues found."
            )}
          </p>
          <p>
            {t(
              "Our website, products and services are directed to persons who are at least 13 years of age or older."
            )}
          </p>
        </div>
        <div className="col-12 border rounded p-4 mb-2">
          <h3>{t("Changes to the privacy policy")}</h3>
          <p>
            {t(
              "To ensure that our policies always comply with current legal requirements, we reserve the right to make changes to ensure that we are always in line with current legislation."
            )}
          </p>
          <p>
            {t(
              "If you think something is missing or should be changed, please contact me to fix it."
            )}
          </p>
          <p className="text-warning">
            {t("Last modification of the policy")}: 30/11/2021
          </p>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Privacy);
