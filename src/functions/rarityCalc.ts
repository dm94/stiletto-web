import { Rarity } from "@ctypes/item";
import type { RarityFactors } from "@ctypes/rarity";
import { getRarityFactors } from "./github";

interface RarityData {
  Uncommon: RarityFactors;
  Rare: RarityFactors;
  Epic: RarityFactors;
  Legendary: RarityFactors;
}

type RarityJsonData = RarityFactors & {
  name: string;
};

const initialRarityData: RarityData = {
  Uncommon: {},
  Rare: {},
  Epic: {},
  Legendary: {},
};

const rarityData: RarityData = await (async () => {
  const mappedRarityData = { ...initialRarityData };
  const rarities = (await getRarityFactors()) as RarityJsonData[];

  for (const rarityInfo of rarities) {
    const { name, ...rarityFactors } = rarityInfo;

    if (name in mappedRarityData) {
      mappedRarityData[name as keyof RarityData] = rarityFactors;
    }
  }

  return mappedRarityData;
})();

const RARITY_MAP: Partial<Record<Rarity, keyof RarityData>> = {
  [Rarity.Uncommon]: "Uncommon",
  [Rarity.Rare]: "Rare",
  [Rarity.Epic]: "Epic",
  [Rarity.Legendary]: "Legendary",
};

const getRarityFactor = (
  rarity: Rarity | undefined,
  factorName: keyof RarityFactors,
): number | undefined => {
  const rarityKey = rarity ? RARITY_MAP[rarity] : undefined;
  return rarityKey ? rarityData?.[rarityKey]?.[factorName] : undefined;
};

export const calcRarityValue = (
  rarity: Rarity | undefined,
  type: string,
  category: string | undefined,
  value: number,
) => {
  const factorName = getFactorName(type, category ?? "");

  if (factorName == null) {
    return value;
  }

  if (
    factorName === "WeaponItemSpeedBonus" ||
    factorName === "ArmorItemReduceBonus"
  ) {
    return sumCalcs(factorName, rarity, value);
  }

  const factorValue = getRarityFactor(rarity, factorName);
  const newValue = factorValue == null ? value : value * factorValue;

  return Number(newValue.toFixed(2));
};

const sumCalcs = (
  factorName: keyof RarityFactors,
  rarity: Rarity | undefined,
  value: number,
): number => {
  const factorValue = getRarityFactor(rarity, factorName);
  const newValue = factorValue == null ? value : value + factorValue;

  return Number(newValue.toFixed(2));
};

const getFactorName = (
  type: string,
  category: string,
): keyof RarityFactors | null => {
  let factorName = null;
  switch (type) {
    case "weight":
      factorName = "ItemWeightFactor";
      break;
    case "durability":
      factorName = "ItemDurabilityFactor";
      if (category === "Weapons") {
        factorName = "WeaponDurabilityFactor";
      } else if (category === "Armors") {
        factorName = "ArmorDurabilityFactor";
      }
      break;
    case "weaponSpeed":
      if (category === "Weapons") {
        factorName = "SiegeWeaponReloadTimeFactor";
      } else {
        factorName = "WeaponItemSpeedBonus";
      }
      break;
    case "damage":
      factorName = "WeaponItemDamageFactor";
      break;
    case "absorbing":
      factorName = "ArmorItemSoakFactor";
      break;
    case "reduction":
      factorName = "ArmorItemReduceBonus";
      break;
    case "hp":
      if (category === "Walkers") {
        factorName = "WalkerHealthFactor";
      } else if (category === "WalkerParts") {
        factorName = "WalkerPartHealthFactor";
      } else if (category === "Exoskeleton") {
        factorName = "ExoskeletonHealthFactor";
      } else if (category === "WalkerTools") {
        factorName = "AutomatonHealthFactor";
      } else {
        factorName = "StructureHealthFactor";
      }
      break;
    case "toolTier":
      factorName = "ToolTierFactor";
      break;
    case "experiencieReward":
      factorName = "CraftingExpFactor";
      if (category === "Resources") {
        factorName = "FoliageExpFactor";
      }
      break;
    case "storage":
      if (category === "Crafting") {
        break;
      }

      factorName = "StorageContainerSlotFactor";
      break;
    default:
      break;
  }

  return factorName as keyof RarityFactors;
};
