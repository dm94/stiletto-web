"use client";

import { useTranslations } from "next-intl";
import Icon from "./Icon";

interface StationProps {
  name?: string;
}

export default function Station({ name }: StationProps) {
  const t = useTranslations();

  if (!name) {
    return null;
  }

  return (
    <div className="text-right mb-0 text-muted">
      {t("made on")} <Icon name={name} /> {t(name)}
    </div>
  );
}
