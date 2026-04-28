import { notFound } from "next/navigation";
import CreatureWiki from "@pages/CreatureWiki";
import { readJsonFile, readOptionalTextFile } from "../../../lib/wikiData";
import type { Creature, CreatureCompleteInfo } from "@ctypes/creature";
import { getItemCodedName, getItemDecodedName, toSnakeCase } from "@functions/utils";

export const revalidate = 86400;

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const creatures = await readJsonFile<Creature[]>("public/json/creatures_min.json");
  const decoded = getItemDecodedName(name);
  const creature = creatures.find((cr) => cr.name.toLowerCase() === decoded);

  if (!creature) {
    notFound();
  }

  const creatureInfo = await readJsonFile<CreatureCompleteInfo>(
    `public/json/creatures/${toSnakeCase(creature.name)}.json`,
  );
  const extraInfoContent = await readOptionalTextFile(
    `wiki/creatures/${getItemCodedName(creature.name)}.md`,
  );

  return (
    <CreatureWiki
      initialCreature={creature}
      initialCreatureInfo={{ ...creatureInfo, ...creature }}
      extraInfoContent={extraInfoContent}
    />
  );
}
