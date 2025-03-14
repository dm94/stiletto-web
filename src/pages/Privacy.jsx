import React from "react";
import { useTranslation } from "react-i18next";
import HeaderMeta from "../components/HeaderMeta";
import { getDomain } from "../functions/utils";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4">
      <HeaderMeta
        title="Privacy Policy - Stiletto for Last Oasis"
        description="Privacy Policy"
        cannonical={`${getDomain()}/privacy`}
      />
      <div className="w-full">
        <h2 className="text-3xl font-bold text-gray-300 text-center mb-4">
          {t("Privacy Policy")}
        </h2>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          {t("What information do we collect?")}
        </h3>
        <p className="text-gray-400 mb-2">
          {t(
            "Cookies - This site only uses Google cookies to view web traffic.",
          )}
        </p>
        <p className="text-gray-400 mb-2">
          {t(
            "Events - We use google to analyse some events in order to use them to improve the website.",
          )}
        </p>
        <p className="text-gray-400">
          {t(
            "Private data - The only registration data saved is Discord ID and Discord Tag.",
          )}
        </p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          {t("What do we use this data for?")}
        </h3>
        <p className="text-gray-400 mb-2">
          {t("To improve the web experience.")}
        </p>
        <p className="text-gray-400">
          {t(
            "To provide some functions such as clan management and map management.",
          )}
        </p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <p className="text-gray-400 mb-2">
          {t(
            "Your Discord Tag and Discord ID can be displayed on our website for different functions such as trading or clan functions.",
          )}
        </p>
        <p className="text-gray-400 mb-2">
          {t(
            "Data added to the website such as diplomacy, map resources or clan members are stored in a database and the necessary security measures are taken so that no one can access these data.",
          )}
        </p>
        <p className="text-gray-400 mb-2">
          {t(
            "Source Code is published on GitHub for full disclosure where you can also report any issues found.",
          )}
        </p>
        <p className="text-gray-400">
          {t(
            "Our website, products and services are directed to persons who are at least 13 years of age or older.",
          )}
        </p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          {t("Changes to the privacy policy")}
        </h3>
        <p className="text-gray-400 mb-2">
          {t(
            "To ensure that our policies always comply with current legal requirements, we reserve the right to make changes to ensure that we are always in line with current legislation.",
          )}
        </p>
        <p className="text-gray-400 mb-2">
          {t(
            "If you think something is missing or should be changed, please contact me to fix it.",
          )}
        </p>
        <p className="text-yellow-400">
          {t("Last modification of the policy")}: 30/11/2021
        </p>
      </div>
    </div>
  );
};

export default Privacy;
