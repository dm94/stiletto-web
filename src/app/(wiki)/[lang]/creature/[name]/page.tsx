import ReactMarkdown from "react-markdown";
import { supportedLanguages } from "@config/languages";
import type { Creature, CreatureCompleteInfo } from "@ctypes/creature";
import CommentsCSR from "@components/Wiki/CommentsCSR";
import {
  getCreaturesMin,
  getCreatureInfoByName,
  getExtraInfoMarkdown,
  resolveCreatureFromParams,
  getCodedNameFromDisplayName,
} from "@lib/wikiStatic";
import { createTranslator } from "@lib/serverTranslations";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const creatures = await getCreaturesMin();
  const codedNames = creatures.map((creature) =>
    getCodedNameFromDisplayName(creature.name),
  );

  const params: Array<{ lang: string; name: string }> = [];
  for (const lang of supportedLanguages) {
    for (const name of codedNames) {
      params.push({ lang: lang.key, name: encodeURIComponent(name) });
    }
  }

  return params;
}

function getDisplayName(creature: Creature, info?: CreatureCompleteInfo) {
  return info?.name ?? creature.name;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; name: string }>;
}) {
  const { lang, name } = await params;
  const t = await createTranslator(lang);

  const creature = await resolveCreatureFromParams(name);
  if (!creature) {
    notFound();
  }

  const [info, extraInfoContent] = await Promise.all([
    getCreatureInfoByName(creature.name),
    getExtraInfoMarkdown("creatures", decodeURI(name)),
  ]);

  const displayName = getDisplayName(creature, info);

  const rows: Array<{ label: string; value: string }> = [];
  if (info?.category || creature.category) {
    rows.push({
      label: t("common.category", { defaultValue: "Category" }),
      value: String(info?.category ?? creature.category ?? ""),
    });
  }
  if (info?.tier) {
    rows.push({
      label: t("creature.tier", { defaultValue: "Tier" }),
      value: String(info.tier),
    });
  }
  if (info?.health != null) {
    rows.push({
      label: t("creature.health", { defaultValue: "Health" }),
      value: String(info.health),
    });
  }

  return (
    <main className="container mx-auto px-4 py-8" data-testid="wiki-creature">
      <h1 className="text-3xl font-bold text-gray-200 mb-4">{displayName}</h1>

      {rows.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("seo.wiki.details", { defaultValue: "Details" })}
          </div>
          <ul className="p-4 space-y-2">
            {rows.map((row) => (
              <li key={row.label} className="flex justify-between gap-4">
                <span className="text-gray-300">{row.label}</span>
                <span className="text-gray-400 text-right">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {extraInfoContent && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("wiki.extraInfo", { defaultValue: "Extra info" })}
          </div>
          <div className="p-4 text-neutral-300 prose prose-invert max-w-none">
            <ReactMarkdown skipHtml={true}>{extraInfoContent}</ReactMarkdown>
          </div>
        </div>
      )}

      <CommentsCSR name={displayName} />
    </main>
  );
}
