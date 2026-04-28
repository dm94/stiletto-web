import ItemWiki from "@pages/ItemWiki";
import { supportedLanguages } from "@config/languages";
import { getExtraInfoMarkdown, getItemInfoByName, getItemsMin, getItemsUsingIngredient, getWalkerUpgradeTable, resolveItemFromParams, getCodedNameFromDisplayName } from "@lib/wikiStatic";
import type { ItemCompleteInfo } from "@ctypes/item";
import { Rarity } from "@ctypes/item";
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
        params.push({ lang: lang.key, name, rarity });
      }
    }
  }

  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; name: string; rarity: string }>;
}) {
  const resolvedParams = await params;
  const item = await resolveItemFromParams(resolvedParams.name);
  if (!item) {
    notFound();
  }

  const [info, extraInfoContent, canBeUsedItems] = await Promise.all([
    getItemInfoByName(item.name),
    getExtraInfoMarkdown("items", getCodedNameFromDisplayName(item.name)),
    getItemsUsingIngredient(item.name),
  ]);

  const initialItemInfo = info ? ({ ...info, ...item } as ItemCompleteInfo) : undefined;
  const category = initialItemInfo?.category ?? item.category;
  const walkerUpgradeTable =
    category === "Walkers" ? await getWalkerUpgradeTable(item.name) : undefined;

  return (
    <ItemWiki
      initialItem={item}
      initialItemInfo={initialItemInfo}
      extraInfoContent={extraInfoContent}
      canBeUsedItems={canBeUsedItems}
      walkerUpgradeTable={walkerUpgradeTable}
    />
  );
}
