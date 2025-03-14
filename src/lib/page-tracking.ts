import { useEffect } from 'react';
import { config } from '@/config/config';

declare global {
  interface Window {
    plausible: {
      (...args: [string, Record<string, unknown>]): void;
      q?: Array<[string, Record<string, unknown>]>;
    };
  }
}

export const initPlausible = () => {
  const PLAUSIBLE_URL = config.PLAUSIBLE_URL;

  if (!PLAUSIBLE_URL || PLAUSIBLE_URL.length <= 0) {
    return;
  }

  const script = document.querySelector(`script[src*="${PLAUSIBLE_URL}"]`);
  if (script) {
    return;
  }

  const element = document.createElement('script');
  element.src = PLAUSIBLE_URL;
  element.defer = true;
  element.setAttribute('data-domain', document.location.hostname);
  document.head.appendChild(element);
};

export const usePageTracking = () => {
  useEffect(() => {
    initPlausible();
  }, []);
};

interface EventProps {
  action: string;
  label: string;
}

interface EventData {
  props: EventProps;
}

export const sendEvent = (eventName: string, data: EventData) => {
  if (typeof window === 'undefined') {
    return;
  }

  initPlausible();

  window.plausible =
    window.plausible ||
    ((eventName: string, data: Record<string, unknown>) => {
      if (!window.plausible.q) {
        window.plausible.q = [];
      }
      window.plausible.q.push([eventName, data]);
    });

  window.plausible(eventName, { props: data.props });
}; 