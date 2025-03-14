export interface Language {
  key: string;
  name: string;
}

export const supportedLanguages: Language[] = [
  { key: "en", name: "English" },
  { key: "es", name: "Spanish" },
  { key: "fr", name: "French" },
  { key: "de", name: "German" },
  { key: "it", name: "Italian" },
  { key: "pt", name: "Portuguese" },
  { key: "ru", name: "Russian" },
  { key: "zh", name: "Chinese" },
];
