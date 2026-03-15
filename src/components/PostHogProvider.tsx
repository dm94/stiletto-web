import { useEffect } from "react";
import { useLocation } from "react-router";
import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (typeof window !== "undefined" && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export function PostHogPageView(): null {
  const location = useLocation();

  useEffect(() => {
    if (POSTHOG_KEY) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
      });
    }
  }, [location]);

  return null;
}
