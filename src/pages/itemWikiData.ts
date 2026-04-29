import { getItems, getItemInfo } from "@functions/github";
import { getItemDecodedName } from "@functions/utils";
import { type Item, type ItemCompleteInfo } from "@ctypes/item";

export type ItemWikiInitialData = {
  itemName: string;
  item?: Item;
  itemInfo?: ItemCompleteInfo;
  allItems: Item[];
};

export const loadItemWikiData = async (
  nameParam?: string,
): Promise<ItemWikiInitialData> => {
  const itemName = nameParam ? getItemDecodedName(nameParam) : "";

  const items = await getItems();
  const foundItem = items.find((it) => it.name.toLowerCase() === itemName);

  try {
    const itemInfo = await getItemInfo(foundItem?.name ?? itemName ?? "");
    return {
      itemName,
      item: foundItem,
      itemInfo: {
        ...itemInfo,
        ...foundItem,
      },
      allItems: items,
    };
  } catch {
    return {
      itemName,
      item: foundItem,
      itemInfo: undefined,
      allItems: items,
    };
  }
};

