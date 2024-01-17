import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const initPlausible = () => {
  const PLAUSIBLE_URL = process.env.REACT_APP_PLAUSIBLE_URL;

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
  const location = useLocation();

  useEffect(() => {
    initPlausible();
  }, []);

  useEffect(() => {
    initPlausible();
  }, [location]);
};

export const sendEvent = (data) => {
  initPlausible();

  window.plausible =
    window.plausible ||
    function() {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };

  window.plausible(...data);
};
