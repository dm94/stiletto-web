import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import i18n from "i18next";
import {
  ANALYTICS_CONSENT_KEY,
  COOKIE_CONSENT_UPDATED_EVENT,
} from "../config/analyticsConsentConstants";

const ANALYTICS_CATEGORY = "analytics";

const syncAnalyticsConsent = (): void => {
  const analyticsAccepted = CookieConsent.acceptedCategory(ANALYTICS_CATEGORY);

  if (analyticsAccepted) {
    globalThis?.localStorage.setItem(ANALYTICS_CONSENT_KEY, "true");
  } else {
    globalThis?.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
  }

  globalThis.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, {
      detail: { analyticsAccepted },
    }),
  );
};

const VanillaCookieConsent = () => {
  const { t } = useTranslation();
  const currentLanguage = i18n.language?.split("-")[0] ?? "en";

  useEffect(() => {
    const translations = {
      consentModal: {
        title: t("common.cookiesTitle"),
        description: t("common.cookiesNotice"),
        acceptAllBtn: t("common.acceptAll"),
        acceptNecessaryBtn: t("common.acceptNecessary"),
        showPreferencesBtn: t("common.showPreferences"),
      },
      preferencesModal: {
        title: t("common.cookiePreferences"),
        acceptAllBtn: t("common.acceptAll"),
        savePreferencesBtn: t("common.savePreferences"),
        closeIconLabel: t("common.close"),
        sections: [
          {
            title: t("common.privacyPolicy"),
            description: t("common.cookiesNotice"),
          },
          {
            title: t("common.strictlyNecessary"),
            description: t("common.necessaryCookiesDescription"),
            linkedCategory: "necessary",
          },
          {
            title: t("common.analytics"),
            description: t("common.analyticsCookiesDescription"),
            linkedCategory: "analytics",
          },
          {
            title: t("common.functionality"),
            description: t("common.functionalityCookiesDescription"),
            linkedCategory: "functionality",
          },
        ],
      },
    };

    CookieConsent.run({
      onFirstConsent: () => {
        syncAnalyticsConsent();
      },
      onConsent: () => {
        syncAnalyticsConsent();
      },
      onChange: () => {
        syncAnalyticsConsent();
      },
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom right",
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
          services: {
            connection: {
              label: "Data storage",
              onAccept: () => {
                localStorage.setItem("acceptscookies", "true");
              },
            },
          },
        },
        analytics: {
          enabled: false,
          readOnly: false,
        },
        functionality: {
          enabled: false,
          readOnly: false,
          services: {
            discordModal: {
              label: "Discord Iframe",
              onAccept: () => {
                localStorage.setItem("discord-iframe", "true");
              },
            },
            giscus: {
              label: "Giscus Comments",
              onAccept: () => {
                localStorage.setItem("giscus", "true");
              },
            },
          },
        },
      },
      language: {
        default: currentLanguage,
        translations: {
          en: translations,
          es: translations,
          ru: translations,
          fr: translations,
          de: translations,
          it: translations,
          ja: translations,
          pl: translations,
          zh: translations,
          pt: translations,
          uk: translations,
        },
      },
    });
  }, [currentLanguage, t]);

  return null;
};

export default VanillaCookieConsent;
