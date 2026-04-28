import CreatureWiki from "@pages/CreatureWiki";
import { supportedLanguages } from "@config/languages";
import { getCodedNameFromDisplayName, getCreatureInfoByName, getCreaturesMin, getExtraInfoMarkdown, resolveCreatureFromParams } from "@lib/wikiStatic";
import type { CreatureCompleteInfo } from "@ctypes/creature";
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
      params.push({ lang: lang.key, name });
    }
  }

  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; name: string }>;
}) {
  const resolvedParams = await params;
  const creature = await resolveCreatureFromParams(resolvedParams.name);
  if (!creature) {
    notFound();
  }

  const [info, extraInfoContent] = await Promise.all([
    getCreatureInfoByName(creature.name),
    getExtraInfoMarkdown("creatures", getCodedNameFromDisplayName(creature.name)),
  ]);

  const initialCreatureInfo = info
    ? ({ ...info, ...creature } as CreatureCompleteInfo)
    : undefined;

  return (
    <CreatureWiki
      initialCreature={creature}
      initialCreatureInfo={initialCreatureInfo}
      extraInfoContent={extraInfoContent}
    />
  );
}
