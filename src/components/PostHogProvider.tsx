import { useEffect } from "react";
import { useLocation } from "react-router";
import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
const ANALYTICS_CONSENT_KEY = "analytics-consent";
const COOKIE_CONSENT_UPDATED_EVENT = "cookie-consent-updated";
let isPostHogInitialized = false;

const hasAnalyticsConsent = (): boolean => {
  return globalThis?.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "true";
};

const initializePostHog = (): void => {
  if (!POSTHOG_KEY || isPostHogInitialized) {
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  });

  isPostHogInitialized = true;
};

const applyAnalyticsConsent = (): void => {
  if (!POSTHOG_KEY) {
    return;
  }

  if (hasAnalyticsConsent()) {
    initializePostHog();
    posthog.opt_in_capturing();
    return;
  }

  if (isPostHogInitialized) {
    posthog.opt_out_capturing();
    posthog.reset();
    isPostHogInitialized = false;
  }
};

export function PostHogPageView(): null {
  const location = useLocation();

  useEffect(() => {
    applyAnalyticsConsent();

    const handleConsentUpdated = (): void => {
      applyAnalyticsConsent();
    };

    globalThis.addEventListener(
      COOKIE_CONSENT_UPDATED_EVENT,
      handleConsentUpdated,
    );

    return () => {
      globalThis.removeEventListener(
        COOKIE_CONSENT_UPDATED_EVENT,
        handleConsentUpdated,
      );
    };
  }, []);

  useEffect(() => {
    if (POSTHOG_KEY && isPostHogInitialized && hasAnalyticsConsent()) {
      const currentUrl = `${globalThis.location.origin}${location.pathname}${location.search}${location.hash}`;
      posthog.capture("$pageview", {
        $current_url: currentUrl,
      });
    }
  }, [location]);

  return null;
}
