import ItemWiki from "@pages/ItemWiki";
import {
  getCodedNameFromDisplayName,
  getExtraInfoMarkdown,
  getItemInfoByName,
  getItemsUsingIngredient,
  getWalkerUpgradeTable,
  resolveItemFromParams,
} from "@lib/wikiStatic";
import type { ItemCompleteInfo } from "@ctypes/item";
import { notFound } from "next/navigation";

export const revalidate = 86400;

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
