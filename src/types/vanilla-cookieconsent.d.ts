// Declaración de tipos para vanilla-cookieconsent

declare global {
  interface Window {
    CookieConsent?: {
      acceptedCategories: () => string[];
      acceptCategory: (category: string) => void;
      rejectCategory: (category: string) => void;
      hidePreferences: () => void;
      showPreferences: () => void;
      hideSettings: () => void;
      showSettings: () => void;
    };
  }
}

export {};
