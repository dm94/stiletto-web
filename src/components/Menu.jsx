import React, { Component } from "react";
import { Link } from "react-router-dom";
import DiscordButton from "./DiscordButton";
import { withTranslation } from "react-i18next";
import { getStoredItem } from "../services";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
    };
  }

  getLanguageFlag = (lng) => {
    const supportedLanguages = [
      "en",
      "es",
      "ru",
      "fr",
      "de",
      "it",
      "ja",
      "pl",
      "zh",
      "pt",
      "uk",
    ];
    if (lng != null) {
      const lngFound = supportedLanguages.find((l) => lng.includes(l));
      if (lngFound) {
        return `/img/${lngFound}.jpg`;
      }
    }

    return "/img/en.jpg";
  };

  searchItem = () => {
    this.props?.setRedirectTo(`/wiki?s=${this.state.searchText}`);
    this.setState({ searchText: "" });
  };

  render() {
    const { t } = this.props;

    return (
      <header>
        <div className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <span>Stiletto</span>
              <img
                width="35"
                height="35"
                alt="Stiletto Logo"
                className="align-top"
                src="/img/icon-01.png"
              />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbar-main-menu"
              aria-controls="navbar-main-menu"
              aria-expanded="false"
              aria-label="Toggle Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                role="img"
                focusable="false"
              >
                <title>{t("Menu")}</title>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M4 7h22M4 15h22M4 23h22"
                />
              </svg>
            </button>
            <div className="collapse navbar-collapse" id="navbar-main-menu">
              <ul
                className="navbar-nav mr-auto mb-2 mb-md-0"
                itemScope="itemscope"
                itemType="https://www.schema.org/SiteNavigationElement"
              >
                <li className="nav-item" data-cy="crafter-link">
                  <Link itemProp="url" className="nav-link" to="/crafter">
                    <span itemProp="name">{t("Crafting")}</span>
                  </Link>
                </li>
                <li className="nav-item" data-cy="maps-link">
                  <Link
                    itemProp="url"
                    className="nav-link"
                    to={getStoredItem("token") != null ? "/maps" : "/map"}
                  >
                    <span itemProp="name">{t("Resource Maps")}</span>
                  </Link>
                </li>
                <li className="nav-item" data-cy="clanlist-link">
                  <Link itemProp="url" className="nav-link" to="/clanlist">
                    <span itemProp="name">{t("Clan List")}</span>
                  </Link>
                </li>
                <li className="nav-item" data-cy="trades-link">
                  <Link itemProp="url" className="nav-link" to="/trades">
                    <span itemProp="name"> {t("Trades")}</span>
                  </Link>
                </li>
                <li className="nav-item" data-cy="wiki-link">
                  <Link itemProp="url" className="nav-link" to="/wiki">
                    <span itemProp="name"> {t("Wiki")}</span>
                  </Link>
                </li>
              </ul>
              <div
                className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"
                role="search"
              >
                <div className="input-group" itemProp="potentialAction">
                  <input
                    type="search"
                    className="form-control"
                    placeholder={t("Search items")}
                    aria-label={t("Search items")}
                    aria-describedby="search-addon"
                    itemProp="query-input"
                    name="search"
                    onChange={(e) =>
                      this.setState({ searchText: e.currentTarget.value })
                    }
                    onKeyPress={(e) => {
                      const keyPress = e.key || e.keyCode;
                      if (keyPress === 13 || keyPress === "Enter") {
                        this.searchItem();
                      }
                    }}
                    value={this.state.searchText}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-info"
                      aria-label="Search button"
                      onClick={() => this.searchItem()}
                    >
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm mr-2"
                data-cy="change-languaje-btn"
                aria-label="Change language"
                onClick={() => {
                  this.props?.openLanguajeModal();
                }}
              >
                <img
                  className="rounded"
                  width="39"
                  height="25"
                  src={this.getLanguageFlag(this.props?.language)}
                  alt="Change language"
                />
              </button>
              <DiscordButton />
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default withTranslation()(Menu);
