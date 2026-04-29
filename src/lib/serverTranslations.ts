import { readJsonFile } from "./wikiData";

type Json = Record<string, unknown>;

const cache = new Map<string, Promise<Json>>();

function getByPath(obj: Json, key: string): string | undefined {
  if (!key) return undefined;
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

async function loadNamespace(lang: string, ns: string): Promise<Json> {
  const cacheKey = `${lang}:${ns}`;
  const existing = cache.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    try {
      return await readJsonFile<Json>(`public/locales/${lang}/${ns}.json`);
    } catch {
      return {};
    }
  })();

  cache.set(cacheKey, promise);
  return promise;
}

export async function createTranslator(lang: string) {
  const [translation, items] = await Promise.all([
    loadNamespace(lang, "translation"),
    loadNamespace(lang, "items"),
  ]);

  return (key: string, options?: { ns?: "translation" | "items"; defaultValue?: string }) => {
    const ns = options?.ns ?? "translation";
    const dict = ns === "items" ? items : translation;
    return getByPath(dict, key) ?? options?.defaultValue ?? key;
  };
}

