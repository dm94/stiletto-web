import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Others from "./Others";
import { getStoredItem } from "../services";
import { getDomain } from "../functions/utils";

class Home extends Component {
  state = { redirectTo: null };
  render() {
    const { t } = this.props;
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return (
      <div className="container-fluid">
        <Helmet>
          <title>Stiletto for the Last Oasis</title>
          <meta
            name="description"
            content="Stiletto the page with utilities for the game Last Oasis. Crafting calculator, Resources map, Quality calculator, Clan management and more..."
          />
          <meta name="theme-color" content="#FFFFFF"></meta>
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
          <link
            rel="canonical"
            href={
              getDomain()
            }
          />
        </Helmet>
        <div className="row mb-4">
          <div
            tabIndex="0"
            className="col-12 col-xl-4"
            role="button"
            onClick={() => this.setState({ redirectTo: "/crafter" })}
            aria-label={t("Crafting Calculator")}
          >
            <h2 className="lo-title">
              {t("Crafting Calculator")}
            </h2>
            <p>
              {t(
                "Here you can see and automatically calculate the materials needed to build each item."
              )}
            </p>
          </div>
          <div
            tabIndex="0"
            className="col-12 col-xl-4"
            role="button"
            onClick={() => this.setState({ redirectTo: "/trades" })}
            aria-label={t("Trading System")}
          >
            <h2 className="lo-title">
              {t("Trading System")}
            </h2>
            <p>
              {t(
                "You can create offers or search for them easily from here, you don't need to be on 20 discord servers looking for who to exchange with"
              )}
            </p>
          </div>
          <div
            tabIndex="0"
            className="col-12 col-xl-4"
            role="button"
            onClick={() =>
              this.setState({
                redirectTo:
                  getStoredItem("discordid") != null ? "/maps" : "/map",
              })
            }
            aria-label={t("Resource Maps")}
          >
            <h2 className="lo-title">
              {t("Resource Maps")}
            </h2>
            <p>
              {t("Create and edit maps to add resources or strategic points.")}
            </p>
          </div>
        </div>
        <Others />
      </div>
    );
  }
}

export default withTranslation()(Home);
