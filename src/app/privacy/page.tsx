"use client";

import { useTranslation } from "next-i18next";
import { memo, useMemo } from "react";
import HeaderMeta from "@components/HeaderMeta";
import { getDomain } from "@functions/utils";

const Privacy = () => {
  const { t } = useTranslation();

  const canonicalUrl = useMemo(() => {
    return `${getDomain()}/privacy`;
  }, []);

  return (
    <div className="container mx-auto px-4">
      <HeaderMeta
        title="Privacy Policy - Stiletto for Last Oasis"
        description="Privacy Policy"
        cannonical={canonicalUrl}
      />
      <div className="w-full">
        <h2 className="text-3xl font-bold text-gray-300 text-center mb-4">
          {t("common.privacyPolicy")}
        </h2>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          {t("common.whatInformationDoWeCollect")}
        </h3>
        <p className="text-gray-400 mb-2">{t("common.cookies")}</p>
        <p className="text-gray-400 mb-2">
          {t(
            "Events - We use google to analyse some events in order to use them to improve the website.",
          )}
        </p>
        <p className="text-gray-400">{t("common.privateData")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          {t("common.whatDoWeUseThisDataFor")}
        </h3>
        <p className="text-gray-400 mb-2">{t("common.improveWebExperience")}</p>
        <p className="text-gray-400">{t("common.provideFunctions")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <p className="text-gray-400 mb-2">
          {t("common.displayDiscordTagAndId")}
        </p>
        <p className="text-gray-400 mb-2">{t("common.dataAddedToWebsite")}</p>
        <p className="text-gray-400 mb-2">
          {t("common.sourceCodePublishedOnGitHub")}
        </p>
        <p className="text-gray-400">{t("common.websiteDirectedTo")}</p>
      </div>
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          {t("common.changesToPrivacyPolicy")}
        </h3>
        <p className="text-gray-400 mb-2">
          {t("common.changesToPrivacyPolicyNotice")}
        </p>
        <p className="text-gray-400 mb-2">{t("common.contactMe")}</p>
        <p className="text-yellow-400">
          {t("common.lastModificationOfPolicy")}: 30/11/2021
        </p>
      </div>
    </div>
  );
};

export default memo(Privacy);
