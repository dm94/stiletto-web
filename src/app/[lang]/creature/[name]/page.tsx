import { supportedLanguages } from "@config/languages";
import type { Creature, CreatureCompleteInfo } from "@ctypes/creature";
import I18nProviderClient from "@components/I18nProviderClient";
import CreatureWiki from "@pages/CreatureWiki";
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

export const dynamic = "force-static";
export const dynamicParams = true;

const languageSet = new Set(supportedLanguages.map((lang) => lang.key));

export async function generateStaticParams() {
  return [];
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; name: string }>;
}) {
  const { lang, name } = await params;

  if (!languageSet.has(lang)) {
    notFound();
  }

  const [creatures, translation, itemNames] = await Promise.all([
    readJsonFile<Creature[]>("public/json/creatures_min.json"),
    readJsonFile<Record<string, unknown>>(`public/locales/${lang}/translation.json`),
    readOptionalJsonFile<Record<string, unknown>>(`public/locales/${lang}/items.json`),
  ]);

  const decodedName = getItemDecodedName(name);
  const creature = creatures.find((cr) => cr.name.toLowerCase() === decodedName);

  if (!creature) {
    notFound();
  }

  const [creatureInfo, extraInfoContent] = await Promise.all([
    readOptionalJsonFile<CreatureCompleteInfo>(
      `public/json/creatures/${toSnakeCase(creature.name)}.json`,
    ),
    readOptionalTextFile(`wiki/creatures/${getItemCodedName(creature.name)}.md`),
  ]);

  const mergedInfo = creatureInfo
    ? ({ ...creatureInfo, ...creature } satisfies CreatureCompleteInfo)
    : undefined;

  return (
    <I18nProviderClient
      lang={lang}
      namespaces={{
        translation,
        items: itemNames ?? {},
      }}
    >
      <CreatureWiki
        initialCreature={creature}
        initialCreatureInfo={mergedInfo}
        extraInfoContent={extraInfoContent}
        disableExternalFetches={true}
      />
    </I18nProviderClient>
  );
}
