const rarityData = {
  Uncommon: {
    StructureHealthFactor: 1.5,
    WalkerHealthFactor: 1.2,
    WalkerPartHealthFactor: 1.35,
    ExoskeletonHealthFactor: 1.05,
    AutomatonHealthFactor: 1.9,
    ItemWeightFactor: 0.95,
    ItemDurabilityFactor: 1.3,
    WeaponItemDamageFactor: 1.25,
    WeaponItemSpeedBonus: 1.0,
    ArmorItemSoakFactor: 1.05,
  },
  Rare: {
    StructureHealthFactor: 2.0,
    WalkerHealthFactor: 1.4,
    WalkerPartHealthFactor: 1.75,
    ExoskeletonHealthFactor: 1.1,
    AutomatonHealthFactor: 1.5,
    ItemWeightFactor: 0.92,
    ItemDurabilityFactor: 1.55,
    WeaponItemDamageFactor: 1.5,
    WeaponItemSpeedBonus: 2.0,
    ArmorItemSoakFactor: 1.1,
    ArmorItemReduceBonus: 1.0,
  },
  Epic: {
    StructureHealthFactor: 2.5,
    WalkerHealthFactor: 1.7,
    WalkerPartHealthFactor: 2.0,
    ExoskeletonHealthFactor: 1.15,
    AutomatonHealthFactor: 2.0,
    ItemWeightFactor: 0.89,
    ItemDurabilityFactor: 1.75,
    WeaponItemDamageFactor: 1.75,
    WeaponItemSpeedBonus: 3.0,
    ArmorItemSoakFactor: 1.15,
    ArmorItemReduceBonus: 2.0,
  },
  Legendary: {
    StructureHealthFactor: 3.0,
    WalkerHealthFactor: 2.2,
    WalkerPartHealthFactor: 2.5,
    WalkerTorqueGenerationFactor: 1.1,
    WalkerModuleSlotIncrease: 2000,
    ExoskeletonHealthFactor: 1.25,
    AutomatonHealthFactor: 2.5,
    ItemWeightFactor: 0.85,
    ItemDurabilityFactor: 2.0,
    WeaponItemDamageFactor: 2.0,
    WeaponItemSpeedBonus: 3.0,
    ArmorItemSoakFactor: 1.25,
    ArmorItemReduceBonus: 3.0,
  },
};

export const calcRarityValue = (rarity, type, category, value) => {
  let factorName = getFactorName(type, category);
  if (factorName != null) {
    if (
      factorName === "WeaponItemSpeedBonus" ||
      factorName === "ArmorItemReduceBonus"
    ) {
      return sumCalcs(factorName, rarity, value);
    }
    switch (rarity) {
      case "Uncommon":
        if (rarityData?.Uncommon[factorName]) {
          value = value * rarityData.Uncommon[factorName];
        }
        break;
      case "Rare":
        if (rarityData?.Rare[factorName]) {
          value = value * rarityData.Rare[factorName];
        }
        break;
      case "Epic":
        if (rarityData?.Epic[factorName]) {
          value = value * rarityData.Epic[factorName];
        }
        break;
      case "Legendary":
        if (rarityData?.Legendary[factorName]) {
          value = value * rarityData.Legendary[factorName];
        }
        break;
      default:
        break;
    }
    if (factorName === "ItemWeightFactor") {
      value = (value / 100).toFixed(3);
    } else {
      value = value.toFixed(0);
    }
  }
  return value;
};

const sumCalcs = (factorName, rarity, value) => {
  switch (rarity) {
    case "Uncommon":
      if (rarityData?.Uncommon[factorName]) {
        value = value + rarityData.Uncommon[factorName];
      }
      break;
    case "Rare":
      if (rarityData?.Rare[factorName]) {
        value = value + rarityData.Rare[factorName];
      }
      break;
    case "Epic":
      if (rarityData?.Epic[factorName]) {
        value = value + rarityData.Epic[factorName];
      }
      break;
    case "Legendary":
      if (rarityData?.Legendary[factorName]) {
        value = value + rarityData.Legendary[factorName];
      }
      break;
    default:
      break;
  }
  value = value.toFixed(0);
  return value;
};

const getFactorName = (type, category) => {
  let factorName = null;
  switch (type) {
    case "weight":
      factorName = "ItemWeightFactor";
      break;
    case "durability":
      factorName = "ItemDurabilityFactor";
      break;
    case "weaponSpeed":
      factorName = "WeaponItemSpeedBonus";
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
    default:
      break;
  }

  return factorName;
};
