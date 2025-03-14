"use client";

import { useTranslations } from "next-intl";

interface StationProps {
  name: string;
}

export default function Station({ name }: StationProps) {
  const t = useTranslations();

  return (
    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      {t("Station")}: {t(name, { ns: "stations" })}
    </div>
  );
}
