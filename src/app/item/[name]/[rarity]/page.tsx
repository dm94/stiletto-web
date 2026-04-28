import { notFound } from "next/navigation";
import ItemWiki from "@pages/ItemWiki";
import { readJsonFile, readOptionalTextFile } from "../../../../lib/wikiData";
import type { Item, ItemCompleteInfo } from "@ctypes/item";
import { getItemCodedName, getItemDecodedName, toSnakeCase } from "@functions/utils";

export const revalidate = 86400;

export default async function Page({
  params,
}: {
  params: Promise<{ name: string; rarity: string }>;
}) {
  const { name } = await params;
  const items = await readJsonFile<Item[]>("public/json/items_min.json");
  const decoded = getItemDecodedName(name);
  const item = items.find((it) => it.name.toLowerCase() === decoded);

  if (!item) {
    notFound();
  }

  const itemInfo = await readJsonFile<ItemCompleteInfo>(
    `public/json/items/${toSnakeCase(item.name)}.json`,
  );
  const extraInfoContent = await readOptionalTextFile(
    `wiki/items/${getItemCodedName(item.name)}.md`,
  );

  return (
    <ItemWiki
      initialItem={item}
      initialItemInfo={{ ...itemInfo, ...item }}
      extraInfoContent={extraInfoContent}
    />
  );
}
