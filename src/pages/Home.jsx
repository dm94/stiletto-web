import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Others from "./Others";

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
              window.location.protocol
                .concat("//")
                .concat(window.location.hostname) +
              (window.location.port ? ":" + window.location.port : "")
            }
          />
        </Helmet>
        <div className="row mb-4">
          <div className="col-12 col-xl-4">
            <h2
              className="lo-title"
              role="button"
              onClick={() => this.setState({ redirectTo: "/crafter" })}
            >
              {t("Crafting Calculator")}
            </h2>
            <p>
              {t(
                "Here you can see and automatically calculate the materials needed to build each item. It is in English and Spanish"
              )}
            </p>
          </div>
          <div className="col-12 col-xl-4">
            <h2
              role="button"
              className="lo-title"
              onClick={() => this.setState({ redirectTo: "/auctions" })}
            >
              {t("Auction Timers")}
            </h2>
            <p>
              {t(
                "See how much time is left to finish the auctions of the maps you want easily"
              )}
            </p>
          </div>
          <div className="col-12 col-xl-4">
            <h2
              role="button"
              className="lo-title"
              onClick={() => this.setState({ redirectTo: "/trades" })}
            >
              {t("Trading System")}
            </h2>
            <p>
              {t(
                "You can create offers or search for them easily from here, you don't need to be on 20 discord servers looking for who to exchange with"
              )}
            </p>
          </div>
          <div className="col-12 col-xl-4">
            <h2
              role="button"
              className="lo-title"
              onClick={() => this.setState({ redirectTo: "/walkerlist" })}
            >
              {t("Walker List")}
            </h2>
            <p>
              {t(
                "Check when your walkers were last used and who used them in a simple and quick way. I have created a discord bot that apart from giving other functions allows you to control the walkers log in an easier way"
              )}
            </p>
          </div>
          <div className="col-12 col-xl-4">
            <h2
              role="button"
              className="lo-title"
              onClick={() =>
                this.setState({
                  redirectTo:
                    localStorage.getItem("discordid") != null
                      ? "/maps"
                      : "/map",
                })
              }
            >
              {t("Resource Maps")}
            </h2>
            <p>
              {t("Create and edit maps to add resources or strategic points.")}
            </p>
          </div>
          <div className="col-12 col-xl-4">
            <h2
              role="button"
              className="lo-title"
              onClick={() => this.setState({ redirectTo: "/tech/Vitamins" })}
            >
              {t("Tech Tree")}
            </h2>
            <p>{t("View and control your clan's technology tree.")}</p>
          </div>
        </div>
        <Others />
      </div>
    );
  }
}

export default withTranslation()(Home);
