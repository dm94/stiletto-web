import { useEffect } from "react";
import { config } from "./config/config";

export const initPlausible = () => {
  const PLAUSIBLE_URL = config.REACT_APP_PLAUSIBLE_URL;

  if (!PLAUSIBLE_URL || PLAUSIBLE_URL.length <= 0) {
    return;
  }

  const script = document.querySelector(`script[src*="${PLAUSIBLE_URL}"]`);
  if (script) {
    return;
  }

  const element = document.createElement("script");
  element.src = PLAUSIBLE_URL;
  element.defer = true;
  element.setAttribute("data-domain", document.location.hostname);
  document.head.appendChild(element);
};

export const usePageTracking = () => {
  useEffect(() => {
    initPlausible();
  }, []);
};

export const sendEvent = (data) => {
  initPlausible();

  try {
    window.plausible =
      window.plausible ||
      function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };
  } catch (error) {
    console.error(error);
  }

  window?.plausible(...data);
};
