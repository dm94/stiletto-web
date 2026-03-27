import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Item } from "@ctypes/item";
import { getItemInfo } from "@functions/github";

const WALKER_UPGRADE_TIERS = [1, 2, 3, 4] as const;
const WALKER_UPGRADE_TYPES = [
  "cargo",
  "water",
  "gear",
  "durability",
  "mobility",
  "torque",
] as const;
const WALKER_UPGRADES_TRANSLATION_PREFIX = "wiki.walkerUpgrades";

type WalkerUpgradeType = (typeof WALKER_UPGRADE_TYPES)[number];
type WalkerUpgradeTier = (typeof WALKER_UPGRADE_TIERS)[number];

type WalkerUpgradeCell = {
  itemName: string;
  upgradeInfo: Record<string, unknown>;
};

type WalkerUpgradeTable = Record<
  WalkerUpgradeTier,
  Partial<Record<WalkerUpgradeType, WalkerUpgradeCell>>
>;

type WalkerUpgradesProps = {
  itemName: string;
  category?: string;
  allItems: Item[];
  textColor: string;
};

const emptyWalkerUpgradeTable = (): WalkerUpgradeTable => ({
  1: {},
  2: {},
  3: {},
  4: {},
});

const WalkerUpgrades: React.FC<WalkerUpgradesProps> = ({
  itemName,
  category,
  allItems,
  textColor,
}) => {
  const { t } = useTranslation();
  const [walkerUpgradeTable, setWalkerUpgradeTable] =
    useState<WalkerUpgradeTable>(emptyWalkerUpgradeTable());

  useEffect(() => {
    const isWalkerItem = category === "Walkers";
    if (!isWalkerItem || allItems.length === 0) {
      setWalkerUpgradeTable(emptyWalkerUpgradeTable());
      return;
    }

    const escapedItemName = itemName.replaceAll(
      /[.*+?^${}()|[\]\\]/g,
      String.raw`\$&`,
    );
    const walkerUpgradePattern = new RegExp(
      `^${escapedItemName} Upgrade (Cargo|Water|Gear|Durability|Mobility|Torque) Tier ([1-4])$`,
      "i",
    );

    let isActive = true;
    const loadWalkerUpgrades = async () => {
      const nextTable: WalkerUpgradeTable = emptyWalkerUpgradeTable();
      const candidateUpgrades = allItems.filter((candidateItem) =>
        walkerUpgradePattern.test(candidateItem.name),
      );

      const upgradeRequests: Array<
        Promise<{
          tier: WalkerUpgradeTier;
          upgradeType: WalkerUpgradeType;
          upgradeCell: WalkerUpgradeCell;
        } | null>
      > = [];

      for (const candidateUpgrade of candidateUpgrades) {
        const patternMatch = candidateUpgrade.name.match(walkerUpgradePattern);
        if (!patternMatch) {
          continue;
        }

        const upgradeType = patternMatch[1].toLowerCase() as WalkerUpgradeType;
        const tier = Number(patternMatch[2]) as WalkerUpgradeTier;
        upgradeRequests.push(
          (async () => {
            try {
              const upgradeItem = await getItemInfo(candidateUpgrade.name);
              if (
                !upgradeItem.upgradeInfo ||
                typeof upgradeItem.upgradeInfo !== "object"
              ) {
                return null;
              }

              return {
                tier,
                upgradeType,
                upgradeCell: {
                  itemName: upgradeItem.name,
                  upgradeInfo: upgradeItem.upgradeInfo as Record<
                    string,
                    unknown
                  >,
                },
              };
            } catch {
              return null;
            }
          })(),
        );
      }

      const upgrades = await Promise.all(upgradeRequests);
      for (const upgrade of upgrades) {
        if (!upgrade) {
          continue;
        }

        nextTable[upgrade.tier][upgrade.upgradeType] = upgrade.upgradeCell;
      }

      if (isActive) {
        setWalkerUpgradeTable(nextTable);
      }
    };

    loadWalkerUpgrades();

    return () => {
      isActive = false;
    };
  }, [allItems, category, itemName]);

  if (category !== "Walkers") {
    return null;
  }

  const upgradesTitle = t(`${WALKER_UPGRADES_TRANSLATION_PREFIX}.title`, {
    defaultValue: "Upgrades",
  });
  const tierHeader = t(`${WALKER_UPGRADES_TRANSLATION_PREFIX}.tierHeader`, {
    defaultValue: "Tier",
  });

  const renderUpgradeCell = (upgradeCell?: WalkerUpgradeCell) => {
    if (!upgradeCell) {
      return <span className="text-gray-500">-</span>;
    }

    const upgradeEntries = Object.entries(upgradeCell.upgradeInfo);
    if (upgradeEntries.length === 0) {
      return <span className="text-gray-500">-</span>;
    }

    return (
      <div className="space-y-1">
        {upgradeEntries.map(([upgradeKey, upgradeValue]) => {
          const parsedUpgradeValue =
            upgradeValue != null && typeof upgradeValue === "object"
              ? JSON.stringify(upgradeValue)
              : String(upgradeValue ?? "-");

          return (
            <div
              key={`${upgradeCell.itemName}-${upgradeKey}`}
              className="text-xs leading-5"
            >
              <span className="text-gray-300 capitalize">
                {t(
                  `${WALKER_UPGRADES_TRANSLATION_PREFIX}.stats.${upgradeKey}`,
                  {
                    defaultValue: t(upgradeKey, { defaultValue: upgradeKey }),
                  },
                )}
              </span>
              <span className={`ml-2 ${textColor}`}>{parsedUpgradeValue}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
        <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
          {upgradesTitle}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-gray-300">{tierHeader}</th>
                {WALKER_UPGRADE_TYPES.map((upgradeType) => (
                  <th
                    key={upgradeType}
                    className="p-3 text-gray-300 capitalize whitespace-nowrap"
                  >
                    {t(
                      `${WALKER_UPGRADES_TRANSLATION_PREFIX}.types.${upgradeType}`,
                      { defaultValue: upgradeType },
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WALKER_UPGRADE_TIERS.map((tier) => (
                <tr
                  key={`walker-upgrade-tier-${tier}`}
                  className="border-b border-gray-700 last:border-b-0"
                >
                  <td className="p-3 text-gray-300 font-medium whitespace-nowrap">
                    {t(`${WALKER_UPGRADES_TRANSLATION_PREFIX}.tierLabel`, {
                      defaultValue: `Tier ${tier}`,
                      tier,
                    })}
                  </td>
                  {WALKER_UPGRADE_TYPES.map((upgradeType) => (
                    <td
                      key={`walker-upgrade-cell-${tier}-${upgradeType}`}
                      className="p-3 align-top text-gray-400 min-w-[120px]"
                    >
                      {renderUpgradeCell(
                        walkerUpgradeTable[tier]?.[upgradeType],
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalkerUpgrades;
