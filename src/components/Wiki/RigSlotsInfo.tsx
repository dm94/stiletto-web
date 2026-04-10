import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { RigSlotKey, RigSlots } from "@ctypes/item";

type RigSlotDisplayConfig = {
  colorClassName: string;
};

const RIG_SLOT_DISPLAY_CONFIG: Record<RigSlotKey, RigSlotDisplayConfig> = {
  cosmetic: {
    colorClassName: "text-blue-600",
  },
  edgeSmall: {
    colorClassName: "text-green-500",
  },
  edgeMedium: {
    colorClassName: "text-green-500",
  },
  edgeLarge: {
    colorClassName: "text-green-500",
  },
  small: {
    colorClassName: "text-red-600",
  },
  medium: {
    colorClassName: "text-red-600",
  },
  large: {
    colorClassName: "text-red-600",
  },
  steeringLever: {
    colorClassName: "text-blue-600",
  },
  special: {
    colorClassName: "text-yellow-400",
  },
};

const RigSlotsInfo = memo(({ rigSlots }: { rigSlots: RigSlots }) => {
  const { t } = useTranslation();
  const slots = useMemo(() => {
    const rigSlotItems: Array<RigSlotDisplayConfig & { key: RigSlotKey; value: number }> = [];

    for (const [key, config] of Object.entries(RIG_SLOT_DISPLAY_CONFIG) as Array<
      [RigSlotKey, RigSlotDisplayConfig]
    >) {
      const value = rigSlots[key];
      if (value === undefined) {
        continue;
      }

      rigSlotItems.push({
        key,
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
