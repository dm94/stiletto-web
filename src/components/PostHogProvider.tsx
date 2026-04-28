import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import {
  ANALYTICS_CONSENT_KEY,
  COOKIE_CONSENT_UPDATED_EVENT,
} from "../config/analyticsConsentConstants";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;
let isPostHogInitialized = false;

const hasAnalyticsConsent = (): boolean => {
  return globalThis?.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "true";
};

const shouldCaptureWithPostHog = (): boolean => {
  return Boolean(POSTHOG_KEY) && isPostHogInitialized && hasAnalyticsConsent();
};

const captureException = (
  exception: unknown,
  extraProperties?: Record<string, unknown>,
): void => {
  if (!shouldCaptureWithPostHog()) {
    return;
  }

  if (typeof posthog.captureException === "function") {
    posthog.captureException(exception, extraProperties);
    return;
  }

  posthog.capture("exception_autocaptured", {
    exception: String(exception),
    ...extraProperties,
  });
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    const handleUnhandledError = (event: ErrorEvent): void => {
      captureException(event.error ?? event.message, {
        source: "window.onerror",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      captureException(event.reason, {
        source: "window.unhandledrejection",
      });
    };

    globalThis.addEventListener("error", handleUnhandledError);
    globalThis.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      globalThis.removeEventListener("error", handleUnhandledError);
      globalThis.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  useEffect(() => {
    if (shouldCaptureWithPostHog()) {
      const search = searchParams?.toString() ?? "";
      const currentUrl = `${globalThis.location.origin}${pathname}${search ? `?${search}` : ""}${globalThis.location.hash}`;
      posthog.capture("$pageview", {
        $current_url: currentUrl,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
