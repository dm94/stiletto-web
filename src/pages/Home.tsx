import type React from "react";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import Others from "@pages/Others";
import { useUser } from "@store/userStore";
import { getDomain } from "@functions/utils";
import { Link } from "react-router";
import HeaderMeta from "@components/HeaderMeta";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { isConnected } = useUser();

  const resourceMapsUrl = useMemo(() => {
    return isConnected ? "/maps" : "/map";
  }, [isConnected]);

  return (
    <div className="container mx-auto px-4">
      <HeaderMeta
        title={t("seo.home.title")}
        description={t(
          "app.metaDescription",
          "Stiletto the page with utilities for the game Last Oasis. Crafting calculator, Resources map, Quality calculator, Clan management and more...",
        )}
        canonical={getDomain()}
        image="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
        keywords="Last Oasis, crafting calculator, resource maps, clan management, quality calculator, game tools, walkers, Last Oasis companion app, survival game tools, Last Oasis resources, game crafting system, walker customization, Last Oasis utility, survival MMO tools"
      >
        <meta name="theme-color" content="#FFFFFF" />
      </HeaderMeta>
      <h1 className="text-4xl text-center lo-title mb-8">
        {t("seo.home.title", "Stiletto for Last Oasis")}
      </h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        <Link
          className="text-center"
          to="/crafter"
          aria-label={t("crafting.calculator")}
        >
          <h2 className="lo-title text-3xl">{t("crafting.calculator")}</h2>
          <p className="text-white">{t("crafting.description")}</p>
        </Link>
        <Link
          className="text-center"
          to="/trades"
          aria-label={t("trades.title")}
        >
          <h2 className="lo-title text-3xl">{t("trades.title")}</h2>
          <p className="text-white">{t("trades.description")}</p>
        </Link>
        <Link
          className="text-center"
          to={resourceMapsUrl}
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
