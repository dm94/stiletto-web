import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Others from "./Others";
import { getStoredItem } from "../functions/services";
import { getDomain } from "../functions/utils";
import { Link } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="container-fluid">
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
        <link rel="canonical" href={getDomain()} />
      </Helmet>
      <div className="row mb-4">
        <Link
          className="col-12 col-xl-4 text-center"
          to="/crafter"
          aria-label={t("Crafting Calculator")}
        >
          <h2 className="lo-title">{t("Crafting Calculator")}</h2>
          <p className="text-white">
            {t(
              "Here you can see and automatically calculate the materials needed to build each item."
            )}
          </p>
        </Link>
        <Link
          className="col-12 col-xl-4 text-center"
          to="/trades"
          aria-label={t("Trading System")}
        >
          <h2 className="lo-title">{t("Trading System")}</h2>
          <p className="text-white">
            {t(
              "You can create offers or search for them easily from here, you don't need to be on 20 discord servers looking for who to exchange with"
            )}
          </p>
        </Link>
        <Link
          className="col-12 col-xl-4 text-center"
          to={getStoredItem("discordid") ? "/maps" : "/map"}
          aria-label={t("Resource Maps")}
        >
          <h2 className="lo-title">{t("Resource Maps")}</h2>
          <p className="text-white">
            {t("Create and edit maps to add resources or strategic points.")}
          </p>
        </Link>
      </div>
      <Others />
    </div>
  );
};

export default Home;
