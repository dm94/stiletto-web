import type React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { memo, useMemo } from "react";
import Others from "./Others";
import { getStoredItem } from "../functions/services";
import { getDomain } from "../functions/utils";
import Link from "next/link";

const Home: React.FC = () => {
  const { t } = useTranslation();

  const resourceMapsUrl = useMemo(() => {
    return getStoredItem("discordid") ? "/maps" : "/map";
  }, []);

  const canonicalUrl = useMemo(() => {
    return getDomain();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <Helmet>
        <title>Stiletto for the Last Oasis</title>
        <meta
          name="description"
          content="Stiletto the page with utilities for the game Last Oasis. Crafting calculator, Resources map, Quality calculator, Clan management and more..."
        />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stiletto for Last Oasis" />
        <meta
          name="twitter:description"
          content="Stiletto the page with utilities for the game Last Oasis"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
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
      <Others />
    </div>
  );
};

export default memo(Home);
