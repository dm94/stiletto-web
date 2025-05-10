import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import HeaderMeta from "@components/HeaderMeta";
import { getDomain } from "@functions/utils";
import PrivacySection from "@components/PrivacySection";

const Privacy = () => {
  const { t } = useTranslation();
  const canonicalUrl = useMemo(() => `${getDomain()}/privacy`, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderMeta
        title={t("privacy.title")}
        description={t("privacy.description")}
        canonical={canonicalUrl}
      />
      <div className="w-full mb-8">
        <h2 className="text-3xl font-bold text-gray-300 text-center mb-4">
          {t("privacy.heading")}
        </h2>
        <p className="text-gray-400 text-center">{t("privacy.lastUpdated")}</p>
      </div>
      <PrivacySection title={t("privacy.introTitle")}>
        <p className="text-gray-400 mb-2">{t("privacy.introText")}</p>
      </PrivacySection>
      <PrivacySection title={t("privacy.dataCollectedTitle")}>
        <ul className="list-disc pl-6 text-gray-400 mb-2">
          <li>{t("privacy.dataCollected.discord")}</li>
          <li>{t("privacy.dataCollected.noOther")}</li>
        </ul>
      </PrivacySection>
      <PrivacySection title={t("privacy.cookiesTitle")}>
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
      </PrivacySection>
      <PrivacySection title={t("privacy.purposeTitle")}>
        <ul className="list-disc pl-6 text-gray-400 mb-2">
          <li>{t("privacy.purpose.improve")}</li>
          <li>{t("privacy.purpose.functions")}</li>
          <li>{t("privacy.purpose.display")}</li>
        </ul>
      </PrivacySection>
      <PrivacySection title={t("privacy.managementTitle")}>
        <p className="text-gray-400 mb-2">{t("privacy.managementText")}</p>
      </PrivacySection>
      <PrivacySection title={t("privacy.securityTitle")}>
        <p className="text-gray-400 mb-2">{t("privacy.securityText")}</p>
      </PrivacySection>
      <PrivacySection title={t("privacy.cookieConsentTitle")}>
        <p className="text-gray-400 mb-2">{t("privacy.cookieConsentText")}</p>
      </PrivacySection>
      <PrivacySection title={t("privacy.rightsTitle")}>
        <p className="text-gray-400 mb-2">{t("privacy.rightsText")}</p>
      </PrivacySection>
      <PrivacySection title={t("privacy.contactTitle")}>
        <p className="text-gray-400 mb-2">{t("privacy.contactText")}</p>
      </PrivacySection>
      <PrivacySection title={t("privacy.changesTitle")}>
        <p className="text-gray-400 mb-2">{t("privacy.changesText")}</p>
      </PrivacySection>
    </div>
  );
};

export default memo(Privacy);
