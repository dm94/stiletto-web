"use client";

import Link from "next/link";
import { useTranslation } from "next-i18next";
import type React from "react";
import { useMemo } from "react";
import { getStoredItem } from "@functions/services";

const HomeLinks: React.FC = () => {
  const { t } = useTranslation();

  const resourceMapsUrl = useMemo(() => {
    return getStoredItem("discordid") ? "/maps" : "/map";
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
      <Link
        className="text-center"
        href="/crafter"
        aria-label={t("crafting.calculator")}
      >
        <h2 className="lo-title text-3xl">{t("crafting.calculator")}</h2>
        <p className="text-white">{t("crafting.description")}</p>
      </Link>
      <Link
        className="text-center"
        href="/trades"
        aria-label={t("trades.title")}
      >
        <h2 className="lo-title text-3xl">{t("trades.title")}</h2>
        <p className="text-white">{t("trades.description")}</p>
      </Link>
      <Link
        className="text-center"
        href={resourceMapsUrl}
        aria-label={t("menu.resourceMaps")}
      >
        <h2 className="lo-title text-3xl">{t("menu.resourceMaps")}</h2>
        <p className="text-white">{t("resourceMaps.description")}</p>
      </Link>
    </div>
  );
};

export default HomeLinks;
