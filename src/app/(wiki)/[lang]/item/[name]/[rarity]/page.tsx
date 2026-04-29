import ReactMarkdown from "react-markdown";
import { supportedLanguages } from "@config/languages";
import type { Item, ItemCompleteInfo } from "@ctypes/item";
import { Rarity } from "@ctypes/item";
import CommentsCSR from "@components/Wiki/CommentsCSR";
import {
  getExtraInfoMarkdown,
  getItemInfoByName,
  getItemsMin,
  getCodedNameFromDisplayName,
  resolveItemFromParams,
} from "@lib/wikiStatic";
import { createTranslator } from "@lib/serverTranslations";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const items = await getItemsMin();
  const codedNames = items.map((item) => getCodedNameFromDisplayName(item.name));
  const rarities = Object.values(Rarity);

  const params: Array<{ lang: string; name: string; rarity: string }> = [];
  for (const lang of supportedLanguages) {
    for (const name of codedNames) {
      for (const rarity of rarities) {
        params.push({ lang: lang.key, name: encodeURIComponent(name), rarity });
      }
    }
  }

  return params;
}

function getDisplayName(item: Item, itemInfo?: ItemCompleteInfo) {
  return itemInfo?.name ?? item.name;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; name: string; rarity: string }>;
}) {
  const { lang, name, rarity } = await params;
  const t = await createTranslator(lang);

  const item = await resolveItemFromParams(name);
  if (!item) {
    notFound();
  }

  const [info, extraInfoContent] = await Promise.all([
    getItemInfoByName(item.name),
    getExtraInfoMarkdown("items", decodeURI(name)),
  ]);

  const displayName = getDisplayName(item, info);
  const title = `${t(displayName, { ns: "items", defaultValue: displayName })} (${rarity})`;

  const rows: Array<{ label: string; value: string }> = [];
  if (info?.category || item.category) {
    rows.push({
      label: t("common.category", { defaultValue: "Category" }),
      value: String(info?.category ?? item.category ?? ""),
    });
  }
  if (info?.description) {
    rows.push({
      label: t("common.description", { defaultValue: "Description" }),
      value: String(info.description),
    });
  }

  return (
    <main className="container mx-auto px-4 py-8" data-testid="wiki-item">
      <h1 className="text-3xl font-bold text-gray-200 mb-4">{title}</h1>

      <div className="mb-6 flex gap-2 flex-wrap">
        {Object.values(Rarity).map((r) => (
          <a
            key={r}
            href={`/${lang}/item/${name}/${r}`}
            className={`px-3 py-2 border rounded-lg ${
              r === rarity ? "border-blue-500 text-blue-400" : "border-gray-700 text-gray-300"
            }`}
          >
            {r}
          </a>
        ))}
      </div>

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
