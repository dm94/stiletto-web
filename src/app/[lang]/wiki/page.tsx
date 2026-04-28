import { supportedLanguages } from "@config/languages";
import I18nProviderClient from "@components/I18nProviderClient";
import Wiki from "@pages/Wiki";
import { readJsonFile, readOptionalJsonFile } from "@lib/wikiData";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

const languageSet = new Set(supportedLanguages.map((lang) => lang.key));

export async function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang: lang.key }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!languageSet.has(lang)) {
    notFound();
  }

  const [translation, itemNames] = await Promise.all([
    readJsonFile<Record<string, unknown>>(`public/locales/${lang}/translation.json`),
    readOptionalJsonFile<Record<string, unknown>>(`public/locales/${lang}/items.json`),
  ]);

  return (
    <I18nProviderClient
      lang={lang}
      namespaces={{
        translation,
        items: itemNames ?? {},
      }}
    >
      <Wiki />
    </I18nProviderClient>
  );
}
