import type { Creature, CreatureCompleteInfo } from "@ctypes/creature";
import type { Item, ItemCompleteInfo } from "@ctypes/item";
import type { Perk } from "@ctypes/perk";
import { getItemCodedName, getItemDecodedName, toSnakeCase } from "@functions/utils";
import { readJsonFile, readOptionalTextFile } from "./wikiData";
import type { WalkerUpgradeCell, WalkerUpgradeTable, WalkerUpgradeTier, WalkerUpgradeType } from "@components/Wiki/WalkerUpgrades";

let itemsMinPromise: Promise<Item[]> | undefined;
let creaturesMinPromise: Promise<Creature[]> | undefined;
let perksMinPromise: Promise<Perk[]> | undefined;

const jsonCache = new Map<string, Promise<unknown>>();

function readJsonCached<T>(relativePath: string): Promise<T> {
  const existing = jsonCache.get(relativePath) as Promise<T> | undefined;
  if (existing) return existing;
  const promise = readJsonFile<T>(relativePath);
  jsonCache.set(relativePath, promise as Promise<unknown>);
  return promise;
}

export function getWikiBuildTimestamp(): string {
  return new Date().toISOString();
}

export async function getItemsMin(): Promise<Item[]> {
  if (!itemsMinPromise) {
    itemsMinPromise = readJsonCached<Item[]>("public/json/items_min.json");
  }
  return itemsMinPromise;
}

export async function getCreaturesMin(): Promise<Creature[]> {
  if (!creaturesMinPromise) {
    creaturesMinPromise = readJsonCached<Creature[]>("public/json/creatures_min.json");
  }
  return creaturesMinPromise;
}

export async function getPerksMin(): Promise<Perk[]> {
  if (!perksMinPromise) {
    perksMinPromise = readJsonCached<Perk[]>("public/json/perks_min.json");
  }
  return perksMinPromise;
}

export async function getItemInfoByName(itemName: string): Promise<ItemCompleteInfo | undefined> {
  try {
    return await readJsonCached<ItemCompleteInfo>(`public/json/items/${toSnakeCase(itemName)}.json`);
  } catch {
    return undefined;
  }
}

export async function getCreatureInfoByName(
  creatureName: string,
): Promise<CreatureCompleteInfo | undefined> {
  try {
    return await readJsonCached<CreatureCompleteInfo>(
      `public/json/creatures/${toSnakeCase(creatureName)}.json`,
    );
  } catch {
    return undefined;
  }
}

export async function getExtraInfoMarkdown(
  type: "items" | "creatures",
  codedName: string,
): Promise<string | undefined> {
  return readOptionalTextFile(`wiki/${type}/${codedName}.md`);
}

let ingredientIndexPromise:
  | Promise<Map<string, Item[]>>
  | undefined;

async function getIngredientIndex(): Promise<Map<string, Item[]>> {
  if (ingredientIndexPromise) return ingredientIndexPromise;

  ingredientIndexPromise = (async () => {
    const items = await getItemsMin();
    const index = new Map<string, Item[]>();

    for (const item of items) {
      const itemSeenIngredients = new Set<string>();
      for (const recipe of item.crafting ?? []) {
        for (const ingredient of recipe.ingredients ?? []) {
          const ingredientName = ingredient.name?.toLowerCase?.();
          if (!ingredientName) continue;
          if (itemSeenIngredients.has(ingredientName)) continue;
          itemSeenIngredients.add(ingredientName);

          const list = index.get(ingredientName);
          if (list) {
            list.push(item);
          } else {
            index.set(ingredientName, [item]);
          }
        }
      }
    }

    return index;
  })();

  return ingredientIndexPromise;
}

export async function getItemsUsingIngredient(ingredientName: string): Promise<Item[]> {
  const index = await getIngredientIndex();
  return index.get(ingredientName.toLowerCase()) ?? [];
}

const walkerUpgradeCache = new Map<string, Promise<WalkerUpgradeTable>>();

export async function getWalkerUpgradeTable(
  walkerName: string,
): Promise<WalkerUpgradeTable> {
  const existing = walkerUpgradeCache.get(walkerName);
  if (existing) return existing;

  const promise = (async () => {
    const items = await getItemsMin();
    const escapedWalkerName = walkerName.replaceAll(
      /[.*+?^${}()|[\]\\]/g,
      String.raw`\$&`,
    );
    const walkerUpgradePattern = new RegExp(
      `^${escapedWalkerName} Upgrade (Cargo|Water|Gear|Durability|Mobility|Torque) Tier ([1-4])$`,
      "i",
    );

    const table: WalkerUpgradeTable = { 1: {}, 2: {}, 3: {}, 4: {} };
    const candidates = items.filter((candidate) => walkerUpgradePattern.test(candidate.name));

    const upgradeRequests: Array<
      Promise<{
        tier: WalkerUpgradeTier;
        upgradeType: WalkerUpgradeType;
        upgradeCell: WalkerUpgradeCell;
      } | null>
    > = [];

    for (const candidate of candidates) {
      const match = candidate.name.match(walkerUpgradePattern);
      if (!match) continue;
      const upgradeType = match[1].toLowerCase() as WalkerUpgradeType;
      const tier = Number(match[2]) as WalkerUpgradeTier;

      upgradeRequests.push(
        (async () => {
          const info = await getItemInfoByName(candidate.name);
          if (!info?.upgradeInfo || typeof info.upgradeInfo !== "object") return null;

          return {
            tier,
            upgradeType,
            upgradeCell: {
              itemName: info.name,
              upgradeInfo: info.upgradeInfo as Record<string, unknown>,
            },
          };
        })(),
      );
    }

    const upgrades = await Promise.all(upgradeRequests);
    for (const upgrade of upgrades) {
      if (!upgrade) continue;
      table[upgrade.tier][upgrade.upgradeType] = upgrade.upgradeCell;
    }

    return table;
  })();

  walkerUpgradeCache.set(walkerName, promise);
  return promise;
}

export async function resolveItemFromParams(nameParam: string): Promise<Item | undefined> {
  const items = await getItemsMin();
  const decoded = getItemDecodedName(nameParam);
  return items.find((it) => it.name.toLowerCase() === decoded);
}

export async function resolveCreatureFromParams(nameParam: string): Promise<Creature | undefined> {
  const creatures = await getCreaturesMin();
  const decoded = getItemDecodedName(nameParam);
  return creatures.find((cr) => cr.name.toLowerCase() === decoded);
}

export function getCodedNameFromDisplayName(displayName: string): string {
  return getItemCodedName(displayName);
}

