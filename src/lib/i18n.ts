import "server-only";
import { supportedLanguages } from "../config/languages";

// Define the dictionary type
export type Dictionary = {
  [key: string]: string | Dictionary;
};

// Define the supported locales
// Filter to only include locales that have translation files
export const locales = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "ja",
  "pl",
  "pt",
  "ru",
  "uk",
  "zh",
  "ca",
];
export const defaultLocale = "en";

// Create a cache for dictionaries
// Only include locales that have translation.json files
const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () =>
    import("../../public/locales/en/translation.json").then(
      (module) => module.default,
    ),
  es: () =>
    import("../../public/locales/es/translation.json").then(
      (module) => module.default,
    ),
  fr: () =>
    import("../../public/locales/fr/translation.json").then(
      (module) => module.default,
    ),
  de: () =>
    import("../../public/locales/de/translation.json").then(
      (module) => module.default,
    ),
  it: () =>
    import("../../public/locales/it/translation.json").then(
      (module) => module.default,
    ),
  ja: () =>
    import("../../public/locales/ja/translation.json").then(
      (module) => module.default,
    ),
  pl: () =>
    import("../../public/locales/pl/translation.json").then(
      (module) => module.default,
    ),
  pt: () =>
    import("../../public/locales/pt/translation.json").then(
      (module) => module.default,
    ),
  ru: () =>
    import("../../public/locales/ru/translation.json").then(
      (module) => module.default,
    ),
  uk: () =>
    import("../../public/locales/uk/translation.json").then(
      (module) => module.default,
    ),
  zh: () =>
    import("../../public/locales/zh/translation.json").then(
      (module) => module.default,
    ),
  ca: () =>
    import("../../public/locales/ca/translation.json").then(
      (module) => module.default,
    ),
  // tr is removed as the translation file doesn't exist
};

// Get dictionary for a specific locale
export const getDictionary = async (oldlocale: string): Promise<Dictionary> => {
  let locale = oldlocale;
  // If the locale is not supported, use the default locale
  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  try {
    return await dictionaries[locale]();
  } catch (error) {
    console.error(`Error loading dictionary for locale: ${locale}`, error);
    return await dictionaries[defaultLocale]();
  }
};

// Helper function to get a nested value from a dictionary using a dot notation path
export const getTranslation = (
  dictionary: Dictionary,
  key: string,
  params?: Record<string, string>,
): string => {
  const keys = key.split(".");
  let value: any = dictionary;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key; // Return the key if the translation is not found
    }
  }

  if (typeof value !== "string") {
    return key;
  }

  // Replace parameters in the translation
  if (params) {
    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      return acc.replace(new RegExp(`{{${paramKey}}}`, "g"), paramValue);
    }, value);
  }

  return value;
};
