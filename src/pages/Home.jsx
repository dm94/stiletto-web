import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

class Home extends Component {
  state = { redirectTo: null };
  render() {
    const { t } = this.props;
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    return (
      <div className="row">
        <Helmet>
          <title>Stiletto for the Last Oasis</title>
          <meta
            name="description"
            content="Stiletto the page with utilities for the game Last Oasis"
          />
          <meta name="theme-color" content="#FFFFFF"></meta>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@dm94dani" />
          <meta name="twitter:title" content="Stiletto" />
          <meta
            name="twitter:description"
            content="Stiletto the page with utilities for the game Last Oasis"
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
          />
        </Helmet>
        <div
          className="col-md-6"
          onClick={() => this.setState({ redirectTo: "/crafter" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-xl-6 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">{t("Crafting Calculator")}</h3>
              <p className="card-text mb-auto">
                {t(
                  "Here you can see and automatically calculate the materials needed to build each item. It is in English and Spanish"
                )}
              </p>
            </div>
            <div className="col-xl-6">
              <img
                alt="Crafting Calculator page"
                className="img-fluid"
                src="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
              />
            </div>
          </div>
        </div>
        <div
          className="col-md-6"
          onClick={() => this.setState({ redirectTo: "/auctions" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-xl-6 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">{t("Auction Timers")}</h3>
              <p className="card-text mb-auto">
                {t(
                  "See how much time is left to finish the auctions of the maps you want easily"
                )}
              </p>
            </div>
            <div className="col-xl-6">
              <img
                alt="Auction Timers page"
                className="img-fluid"
                src="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/timers.jpg"
              />
            </div>
          </div>
        </div>
        <div
          className="col-md-6"
          onClick={() => this.setState({ redirectTo: "/trades" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-xl-6 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">{t("Trading System")}</h3>
              <p className="card-text mb-auto">
                {t(
                  "You can create offers or search for them easily from here, you don't need to be on 20 discord servers looking for who to exchange with"
                )}
              </p>
            </div>
            <div className="col-xl-6">
              <img
                alt="Trading System page"
                className="img-fluid"
                src="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/trades.jpg"
              />
            </div>
          </div>
        </div>
        <div
          className="col-md-6"
          onClick={() => this.setState({ redirectTo: "/map" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-xl-6 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">{t("Resource Maps")}</h3>
              <p className="card-text mb-auto">
                {t(
                  "Create and edit maps to add resources or strategic points."
                )}
              </p>
            </div>
            <div className="col-xl-6">
              <img
                alt="Resource Maps page"
                className="img-fluid"
                src="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
              />
            </div>
          </div>
        </div>
        <div
          className="col-md-6"
          onClick={() => this.setState({ redirectTo: "/walkerlist" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-xl-6 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">{t("Walker List")}</h3>
              <p className="card-text mb-auto">
                {t(
                  "Check when your walkers were last used and who used them in a simple and quick way. I have created a discord bot that apart from giving other functions allows you to control the walkers log in an easier way"
                )}
              </p>
            </div>
            <div className="col-xl-6">
              <img
                alt="Walker List page"
                className="img-fluid"
                src="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/walkersList.png"
              />
            </div>
          </div>
        </div>
        <div
          className="col-md-6"
          onClick={() => this.setState({ redirectTo: "/diplomacy" })}
        >
          <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
            <div className="col-xl-6 p-4 d-flex flex-column position-static">
              <h3 className="mb-0">{t("Clan Diplomacy")}</h3>
              <p className="card-text mb-auto">
                {t(
                  "Use this section to control your clan, make alliances or send wars and to easily show it to your clan members."
                )}
              </p>
            </div>
            <div className="col-xl-6">
              <img
                alt="Clan Diplomacy page"
                className="img-fluid"
                src="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Home);
