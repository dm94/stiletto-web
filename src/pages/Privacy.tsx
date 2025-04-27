import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import HeaderMeta from "@components/HeaderMeta";
import { getDomain } from "@functions/utils";

const Privacy = () => {
  const { t } = useTranslation();
  const canonicalUrl = useMemo(() => `${getDomain()}/privacy`, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderMeta
        title={t("privacy.title")}
        description={t("privacy.description")}
        cannonical={canonicalUrl}
      />
      <div className="w-full mb-8">
        <h2 className="text-3xl font-bold text-gray-300 text-center mb-4">
          {t("privacy.heading")}
        </h2>
        <p className="text-gray-400 text-center">{t("privacy.lastUpdated")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.introTitle")}
        </h3>
        <p className="text-gray-400 mb-2">{t("privacy.introText")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.dataCollectedTitle")}
        </h3>
        <ul className="list-disc pl-6 text-gray-400 mb-2">
          <li>{t("privacy.dataCollected.discord")}</li>
          <li>{t("privacy.dataCollected.noOther")}</li>
        </ul>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.cookiesTitle")}
        </h3>
        <ul className="list-disc pl-6 text-gray-400 mb-2">
          <li>{t("privacy.cookies.analytics")}</li>
          <li>{t("privacy.cookies.discordWidget")}</li>
          <li>{t("privacy.cookies.giscus")}</li>
        </ul>
        <p className="text-gray-400 mb-2">
          {t("privacy.cookies.library1")}{" "}
          <a
            href="https://github.com/orestbida/cookieconsent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            cookieconsent
          </a>{" "}
          {t("privacy.cookies.library2")}
        </p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.purposeTitle")}
        </h3>
        <ul className="list-disc pl-6 text-gray-400 mb-2">
          <li>{t("privacy.purpose.improve")}</li>
          <li>{t("privacy.purpose.functions")}</li>
          <li>{t("privacy.purpose.display")}</li>
        </ul>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.managementTitle")}
        </h3>
        <p className="text-gray-400 mb-2">{t("privacy.managementText")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.securityTitle")}
        </h3>
        <p className="text-gray-400 mb-2">{t("privacy.securityText")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.cookieConsentTitle")}
        </h3>
        <p className="text-gray-400 mb-2">{t("privacy.cookieConsentText")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.rightsTitle")}
        </h3>
        <p className="text-gray-400 mb-2">{t("privacy.rightsText")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.contactTitle")}
        </h3>
        <p className="text-gray-400 mb-2">{t("privacy.contactText")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {t("privacy.changesTitle")}
        </h3>
        <p className="text-gray-400 mb-2">{t("privacy.changesText")}</p>
      </div>
    </div>
  );
};

export default memo(Privacy);
