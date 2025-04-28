interface RarityFactors {
  WalkerHealthFactor?: number;
  WalkerPartHealthFactor?: number;
  WalkerTorqueGenerationFactor?: number;
  StructureHealthFactor?: number;
  ExoskeletonHealthFactor?: number;
  ExoskeletonAmmoSlotIncrease?: number;
  AutomatonHealthFactor?: number;
  AutomatonRotationRateFactor?: number;
  SiegeWeaponReloadTimeFactor?: number;
  SiegeWeaponRotationSpeedFactor?: number;
  CraftingTimeFactor?: number;
  VitaminDurationFactor?: number;
  GrapplingHookStaminaCostFactor?: number;
  ProjectileInitialVelocityFactor?: number;
  WingsuitStaminaCostFactor?: number;
  HealingStatusEffectFactor?: number;
  LiquidContainerStackSizeFactor?: number;
  TorqueContainerStackSizeFactor?: number;
  BagContainerSlotFactor?: number;
  StorageContainerSlotFactor?: number;
  HarvestCriticalChance?: number;
  SiegeWeaponDamageFactor?: number;
  CraftingExpFactor?: number;
  ItemUsageExpFactor?: number;
  FoliageExpFactor?: number;
  ItemWeightFactor?: number;
  WeaponDurabilityFactor?: number;
  ArmorDurabilityFactor?: number;
  ToolDurabilityFactor?: number;
  ToolTierFactor?: number;
  WeaponItemDamageFactor?: number;
  WeaponItemSpeedBonus?: number;
  ArmorItemSoakFactor?: number;
  ArmorItemReduceBonus?: number;
  WeaponStaminaCostFactor?: number;
  MobHealthFactor?: number;
  MobDamageFactor?: number;
  MobStructureHealthFactor?: number;
  MobProjectileDamageFactor?: number;
  ItemDurabilityFactor?: number;
}

interface RarityData {
  Uncommon: RarityFactors;
  Rare: RarityFactors;
  Epic: RarityFactors;
  Legendary: RarityFactors;
}

const rarityData: RarityData = {
  Uncommon: {
    WalkerHealthFactor: 1.25,
    WalkerPartHealthFactor: 1.25,
    WalkerTorqueGenerationFactor: 1.05,
    StructureHealthFactor: 1.25,
    ExoskeletonHealthFactor: 1.25,
    AutomatonHealthFactor: 1.25,
    AutomatonRotationRateFactor: 1.2,
    SiegeWeaponReloadTimeFactor: 0.95,
    SiegeWeaponRotationSpeedFactor: 1.05,
    CraftingTimeFactor: 0.9,
    VitaminDurationFactor: 1.5,
    GrapplingHookStaminaCostFactor: 0.8,
    ProjectileInitialVelocityFactor: 1.05,
    WingsuitStaminaCostFactor: 0.85,
    HealingStatusEffectFactor: 1.07,
    LiquidContainerStackSizeFactor: 1.05,
    TorqueContainerStackSizeFactor: 1.05,
    BagContainerSlotFactor: 1.25,
    StorageContainerSlotFactor: 1.25,
    HarvestCriticalChance: 0.15,
    SiegeWeaponDamageFactor: 1.05,
    CraftingExpFactor: 1.5,
    ItemUsageExpFactor: 1.1,
    FoliageExpFactor: 1.1,
    ItemWeightFactor: 0.9,
    WeaponDurabilityFactor: 1.3,
    ArmorDurabilityFactor: 1.3,
    ToolDurabilityFactor: 1.3,
    ToolTierFactor: 1.2,
    WeaponItemDamageFactor: 1.2,
    WeaponItemSpeedBonus: 1.5,
    ArmorItemSoakFactor: 1.2,
    ArmorItemReduceBonus: 1.2,
    WeaponStaminaCostFactor: 0.95,
    MobHealthFactor: 1.25,
    MobDamageFactor: 1.25,
    MobStructureHealthFactor: 1.25,
    MobProjectileDamageFactor: 1.25,
  },
  Rare: {
    WalkerHealthFactor: 1.5,
    WalkerPartHealthFactor: 1.5,
    WalkerTorqueGenerationFactor: 1.1,
    StructureHealthFactor: 1.5,
    ExoskeletonHealthFactor: 1.5,
    ExoskeletonAmmoSlotIncrease: 1,
    AutomatonHealthFactor: 1.5,
    AutomatonRotationRateFactor: 1.3,
    SiegeWeaponReloadTimeFactor: 0.92,
    SiegeWeaponRotationSpeedFactor: 1.1,
    CraftingTimeFactor: 0.75,
    VitaminDurationFactor: 2.0,
    GrapplingHookStaminaCostFactor: 0.6,
    ProjectileInitialVelocityFactor: 1.1,
    WingsuitStaminaCostFactor: 0.7,
    HealingStatusEffectFactor: 1.14,
    LiquidContainerStackSizeFactor: 1.1,
    TorqueContainerStackSizeFactor: 1.1,
    BagContainerSlotFactor: 1.5,
    StorageContainerSlotFactor: 1.5,
    HarvestCriticalChance: 0.3,
    SiegeWeaponDamageFactor: 1.2,
    CraftingExpFactor: 2.5,
    ItemUsageExpFactor: 1.2,
    FoliageExpFactor: 1.5,
    ItemWeightFactor: 0.8,
    WeaponDurabilityFactor: 1.7,
    ArmorDurabilityFactor: 1.7,
    ToolDurabilityFactor: 1.7,
    ToolTierFactor: 1.4,
    WeaponItemDamageFactor: 1.28,
    WeaponItemSpeedBonus: 2.0,
    ArmorItemSoakFactor: 1.28,
    ArmorItemReduceBonus: 1.28,
    WeaponStaminaCostFactor: 0.92,
    MobHealthFactor: 1.5,
    MobDamageFactor: 1.5,
    MobStructureHealthFactor: 1.5,
    MobProjectileDamageFactor: 1.5,
  },
  Epic: {
    WalkerHealthFactor: 1.75,
    WalkerPartHealthFactor: 1.75,
    WalkerTorqueGenerationFactor: 1.15,
    StructureHealthFactor: 1.75,
    ExoskeletonHealthFactor: 1.75,
    AutomatonHealthFactor: 1.75,
    AutomatonRotationRateFactor: 1.4,
    SiegeWeaponReloadTimeFactor: 0.89,
    SiegeWeaponRotationSpeedFactor: 1.15,
    CraftingTimeFactor: 0.65,
    VitaminDurationFactor: 2.5,
    GrapplingHookStaminaCostFactor: 0.4,
    ProjectileInitialVelocityFactor: 1.15,
    WingsuitStaminaCostFactor: 0.55,
    HealingStatusEffectFactor: 1.22,
    LiquidContainerStackSizeFactor: 1.15,
    TorqueContainerStackSizeFactor: 1.15,
    BagContainerSlotFactor: 1.75,
    StorageContainerSlotFactor: 1.75,
    HarvestCriticalChance: 0.45,
    SiegeWeaponDamageFactor: 1.35,
    CraftingExpFactor: 4.0,
    ItemUsageExpFactor: 1.3,
    FoliageExpFactor: 2.0,
    ItemWeightFactor: 0.65,
    WeaponDurabilityFactor: 2.3,
    ArmorDurabilityFactor: 2.3,
    ToolDurabilityFactor: 2.3,
    ToolTierFactor: 1.6,
    WeaponItemDamageFactor: 1.35,
    WeaponItemSpeedBonus: 2.5,
    ArmorItemSoakFactor: 1.35,
    ArmorItemReduceBonus: 1.35,
    WeaponStaminaCostFactor: 0.89,
    MobHealthFactor: 1.75,
    MobDamageFactor: 1.75,
    MobStructureHealthFactor: 1.75,
    MobProjectileDamageFactor: 1.75,
  },
  Legendary: {
    WalkerHealthFactor: 2.0,
    WalkerPartHealthFactor: 2.0,
    WalkerTorqueGenerationFactor: 1.2,
    StructureHealthFactor: 2.0,
    ExoskeletonHealthFactor: 2.0,
    ExoskeletonAmmoSlotIncrease: 2,
    AutomatonRotationRateFactor: 1.5,
    SiegeWeaponReloadTimeFactor: 0.85,
    SiegeWeaponRotationSpeedFactor: 1.25,
    VitaminDurationFactor: 3.0,
    GrapplingHookStaminaCostFactor: 0.2,
    ProjectileInitialVelocityFactor: 1.2,
    WingsuitStaminaCostFactor: 0.4,
    HealingStatusEffectFactor: 1.3,
    LiquidContainerStackSizeFactor: 1.2,
    TorqueContainerStackSizeFactor: 1.2,
    BagContainerSlotFactor: 2.0,
    StorageContainerSlotFactor: 2.0,
    HarvestCriticalChance: 0.6,
    SiegeWeaponDamageFactor: 1.5,
    CraftingExpFactor: 6.5,
    ItemUsageExpFactor: 1.4,
    FoliageExpFactor: 5.0,
    ItemWeightFactor: 0.5,
    WeaponDurabilityFactor: 3.0,
    ArmorDurabilityFactor: 3.0,
    ToolDurabilityFactor: 3.0,
    ToolTierFactor: 1.8,
    WeaponItemDamageFactor: 1.4,
    ArmorItemSoakFactor: 1.4,
    ArmorItemReduceBonus: 1.4,
    WeaponStaminaCostFactor: 0.85,
    MobHealthFactor: 2.0,
    MobDamageFactor: 2.0,
    MobStructureHealthFactor: 2.0,
    MobProjectileDamageFactor: 2.0,
  },
};

export const calcRarityValue = (
  rarity: string | undefined,
  type: string,
  category: string | undefined,
  value: number,
) => {
  const factorName = getFactorName(type, category ?? "");
  let newValue = value;

  if (factorName != null) {
    if (
      factorName === "WeaponItemSpeedBonus" ||
      factorName === "ArmorItemReduceBonus"
    ) {
      return sumCalcs(factorName, rarity, newValue);
    }

    switch (rarity) {
      case "Uncommon":
        if (rarityData.Uncommon[factorName]) {
          newValue = newValue * rarityData.Uncommon[factorName];
        }
        break;
      case "Rare":
        if (rarityData.Rare[factorName]) {
          newValue = newValue * rarityData.Rare[factorName];
        }
        break;
      case "Epic":
        if (rarityData.Epic[factorName]) {
          newValue = newValue * rarityData.Epic[factorName];
        }
        break;
      case "Legendary":
        if (rarityData.Legendary[factorName]) {
          newValue = newValue * rarityData.Legendary[factorName];
        }
        break;
      default:
        break;
    }
    if (factorName === "ItemWeightFactor") {
      newValue = Number((newValue / 100).toFixed(3));
    } else {
      newValue = Number(newValue.toFixed(0));
    }
  }

  return newValue;
};

const sumCalcs = (
  factorName: keyof RarityFactors,
  rarity: string | undefined,
  value: number,
): number => {
  let newValue = value;

  switch (rarity) {
    case "Uncommon":
      if (rarityData.Uncommon?.[factorName]) {
        newValue = newValue + rarityData.Uncommon[factorName];
      }
      break;
    case "Rare":
      if (rarityData.Rare?.[factorName]) {
        newValue = newValue + rarityData.Rare[factorName];
      }
      break;
    case "Epic":
      if (rarityData.Epic?.[factorName]) {
        newValue = newValue + rarityData.Epic[factorName];
      }
      break;
    case "Legendary":
      if (rarityData.Legendary?.[factorName]) {
        newValue = newValue + rarityData.Legendary[factorName];
      }
      break;
    default:
      break;
  }

  newValue = Number(newValue.toFixed(0));

  return newValue;
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
      }
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
    case "toolTier":
      factorName = "ToolTierFactor";
      break;
    case "experiencieReward":
      factorName = "CraftingExpFactor";
      break;
    default:
      break;
  }

  return factorName as keyof RarityFactors;
};
