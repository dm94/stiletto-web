"use client";

import { useTranslations } from "next-intl";

interface CraftingTimeProps {
  time: number;
  total: number;
}

export default function CraftingTime({ time, total }: CraftingTimeProps) {
  const t = useTranslations();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (remainingSeconds > 0 || parts.length === 0) {
      parts.push(`${remainingSeconds}s`);
    }

    return parts.join(" ");
  };

  const totalTime = time * total;

  return (
    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      {t("Crafting Time")}: {formatTime(totalTime)}
    </div>
  );
}
