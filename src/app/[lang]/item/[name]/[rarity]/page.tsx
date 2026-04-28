import { supportedLanguages } from "@config/languages";
import type { Item, ItemCompleteInfo, Rarity } from "@ctypes/item";
import I18nProviderClient from "@components/I18nProviderClient";
import ItemWiki from "@pages/ItemWiki";
import {
  readJsonFile,
  readOptionalJsonFile,
  readOptionalTextFile,
} from "@lib/wikiData";
import {
  getItemCodedName,
  getItemDecodedName,
  toSnakeCase,
} from "@functions/utils";
import { notFound } from "next/navigation";
import { Rarity as RarityEnum } from "@ctypes/item";

export const dynamic = "force-static";
export const dynamicParams = true;

const languageSet = new Set(supportedLanguages.map((lang) => lang.key));
const rarities = Object.values(RarityEnum);

export async function generateStaticParams() {
  return [];
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; name: string; rarity: string }>;
}) {
  const { lang, name, rarity } = await params;

  if (!languageSet.has(lang)) {
    notFound();
  }

  if (!rarities.includes(rarity as Rarity)) {
    notFound();
  }

  const [items, translation, itemNames] = await Promise.all([
    readJsonFile<Item[]>("public/json/items_min.json"),
    readJsonFile<Record<string, unknown>>(
      `public/locales/${lang}/translation.json`,
    ),
    readOptionalJsonFile<Record<string, unknown>>(
      `public/locales/${lang}/items.json`,
    ),
  ]);

  const decodedName = getItemDecodedName(name);
  const item = items.find((it) => it.name.toLowerCase() === decodedName);

  if (!item) {
    notFound();
  }

  const [itemInfo, extraInfoContent] = await Promise.all([
    readOptionalJsonFile<ItemCompleteInfo>(
      `public/json/items/${toSnakeCase(item.name)}.json`,
    ),
    readOptionalTextFile(`wiki/items/${getItemCodedName(item.name)}.md`),
  ]);

  const mergedInfo = itemInfo
    ? ({ ...itemInfo, ...item } satisfies ItemCompleteInfo)
    : undefined;

  return (
    <I18nProviderClient
      lang={lang}
      namespaces={{
        translation,
        items: itemNames ?? {},
      }}
    >
      <ItemWiki
        initialItem={item}
        initialItemInfo={mergedInfo}
        extraInfoContent={extraInfoContent}
        disableExternalFetches={true}
      />
    </I18nProviderClient>
  );
}
