import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { RigSlots } from "@ctypes/item";

enum RigSlotKey {
  Cosmetic = "cosmetic",
  EdgeSmall = "edgeSmall",
  EdgeMedium = "edgeMedium",
  EdgeLarge = "edgeLarge",
  Small = "small",
  Medium = "medium",
  Large = "large",
  SteeringLever = "steeringLever",
  Special = "special",
}

type RigSlotDisplayConfig = {
  key: RigSlotKey;
  colorClassName: string;
};

const RIG_SLOT_DISPLAY_CONFIG: RigSlotDisplayConfig[] = [
  {
    key: RigSlotKey.Cosmetic,
    colorClassName: "text-blue-600",
  },
  {
    key: RigSlotKey.EdgeSmall,
    colorClassName: "text-green-500",
  },
  {
    key: RigSlotKey.EdgeMedium,
    colorClassName: "text-green-500",
  },
  {
    key: RigSlotKey.EdgeLarge,
    colorClassName: "text-green-500",
  },
  {
    key: RigSlotKey.Small,
    colorClassName: "text-red-600",
  },
  {
    key: RigSlotKey.Medium,
    colorClassName: "text-red-600",
  },
  {
    key: RigSlotKey.Large,
    colorClassName: "text-red-600",
  },
  {
    key: RigSlotKey.SteeringLever,
    colorClassName: "text-blue-600",
  },
  {
    key: RigSlotKey.Special,
    colorClassName: "text-yellow-400",
  },
];

const RigSlotsInfo = memo(({ rigSlots }: { rigSlots: RigSlots }) => {
  const { t } = useTranslation();
  const slots = useMemo(() => {
    const rigSlotItems: Array<RigSlotDisplayConfig & { value: number }> = [];

    for (const config of RIG_SLOT_DISPLAY_CONFIG) {
      const value = rigSlots[config.key];
      if (value === undefined) {
        continue;
      }

      rigSlotItems.push({
        ...config,
        value,
      });
    }

    return rigSlotItems;
  }, [rigSlots]);

  if (slots.length === 0) {
    return null;
  }

  return (
    <li className="p-3 border-b border-gray-700 last:border-b-0">
      <div className="text-gray-300 mb-3">{t("wiki.rigslots.title")}</div>
      <div className="space-y-2">
        {slots.map((slot) => (
          <div key={slot.key} className="flex items-center justify-end gap-2">
            <span className="text-gray-300 tabular-nums">{slot.value}x</span>
            <span className={`font-semibold ${slot.colorClassName}`}>
              {t(`wiki.rigslots.${slot.key}`)}
            </span>
          </div>
        ))}
      </div>
    </li>
  );
});

RigSlotsInfo.displayName = "RigSlotsInfo";

export default RigSlotsInfo;
