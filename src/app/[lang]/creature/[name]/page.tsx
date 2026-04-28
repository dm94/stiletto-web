import CreatureWiki from "@pages/CreatureWiki";
import {
  getCodedNameFromDisplayName,
  getCreatureInfoByName,
  getExtraInfoMarkdown,
  resolveCreatureFromParams,
} from "@lib/wikiStatic";
import type { CreatureCompleteInfo } from "@ctypes/creature";
import { notFound } from "next/navigation";

export const revalidate = 86400;

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
