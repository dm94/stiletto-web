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
            content="Stiletto the page with utilities for the game Last Oasis"
          />
          <meta name="theme-color" content="#FFFFFF"></meta>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Stiletto" />
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
        <div
          id="carouselHome"
          className="carousel slide d-none d-md-block"
          data-ride="carousel"
        >
          <ol className="carousel-indicators">
            <li
              data-target="#carouselHome"
              data-slide-to="0"
              className="active"
            ></li>
            <li data-target="#carouselHome" data-slide-to="1"></li>
            <li data-target="#carouselHome" data-slide-to="2"></li>
            <li data-target="#carouselHome" data-slide-to="3"></li>
            <li data-target="#carouselHome" data-slide-to="4"></li>
            <li data-target="#carouselHome" data-slide-to="5"></li>
          </ol>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <svg
                className="d-block w-100"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                role="img"
              ></svg>
              <div
                className="carousel-caption d-none d-md-block"
                onClick={() => this.setState({ redirectTo: "/crafter" })}
              >
                <h2 className="font-weight-bold font-italic text-info">
                  {t("Crafting Calculator")}
                </h2>
                <p className="text-info">
                  {t(
                    "Here you can see and automatically calculate the materials needed to build each item. It is in English and Spanish"
                  )}
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <svg
                className="d-block w-100"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                role="img"
              ></svg>
              <div
                className="carousel-caption d-none d-md-block"
                onClick={() => this.setState({ redirectTo: "/auctions" })}
              >
                <h2 className="font-weight-bold font-italic text-info">
                  {t("Auction Timers")}
                </h2>
                <p className="text-info">
                  {t(
                    "See how much time is left to finish the auctions of the maps you want easily"
                  )}
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <svg
                className="d-block w-100"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                role="img"
              ></svg>
              <div
                className="carousel-caption d-none d-md-block text-info"
                onClick={() => this.setState({ redirectTo: "/trades" })}
              >
                <h2 className="font-weight-bold font-italic">
                  {t("Trading System")}
                </h2>
                <p className="text-info">
                  {t(
                    "You can create offers or search for them easily from here, you don't need to be on 20 discord servers looking for who to exchange with"
                  )}
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <svg
                className="d-block w-100"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
              ></svg>
              <div
                className="carousel-caption d-none d-md-block"
                onClick={() => this.setState({ redirectTo: "/map" })}
              >
                <h2 className="font-weight-bold font-italic text-info">
                  {t("Resource Maps")}
                </h2>
                <p className="text-info">
                  {t(
                    "Create and edit maps to add resources or strategic points."
                  )}
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <svg
                className="d-block w-100"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
              ></svg>
              <div
                className="carousel-caption"
                onClick={() => this.setState({ redirectTo: "/walkerlist" })}
              >
                <h2 className="font-weight-bold font-italic text-info">
                  {t("Walker List")}
                </h2>
                <p className="text-info">
                  {t(
                    "Check when your walkers were last used and who used them in a simple and quick way. I have created a discord bot that apart from giving other functions allows you to control the walkers log in an easier way"
                  )}
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <svg
                className="d-block w-100"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
              ></svg>
              <div
                className="carousel-caption"
                onClick={() => this.setState({ redirectTo: "/diplomacy" })}
              >
                <h2 className="font-weight-bold font-italic text-info">
                  {t("Clan Diplomacy")}
                </h2>
                <p className="text-info">
                  {t(
                    "Use this section to control your clan, make alliances or send wars and to easily show it to your clan members."
                  )}
                </p>
              </div>
            </div>
          </div>
          <a
            className="carousel-control-prev"
            href="#carouselHome"
            role="button"
            data-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href="#carouselHome"
            role="button"
            data-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
        <Others />
      </div>
    );
  }
}

export default withTranslation()(Home);
