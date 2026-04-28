import { notFound } from "next/navigation";
import ItemWiki from "@pages/ItemWiki";
import { readJsonFile, readOptionalTextFile } from "../../../../lib/wikiData";
import { Rarity, type Item, type ItemCompleteInfo } from "@ctypes/item";
import { getItemCodedName, getItemDecodedName, toSnakeCase } from "@functions/utils";

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const items = await readJsonFile<Item[]>("public/json/items_min.json");
  const rarities = Object.values(Rarity);

  const params: Array<{ name: string; rarity: string }> = [];
  for (const item of items) {
    const name = getItemCodedName(item.name);
    for (const rarity of rarities) {
      params.push({ name, rarity });
    }
  }

  return params;
}

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
