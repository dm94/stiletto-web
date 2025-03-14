import React, { useState } from "react";
import { Link } from "react-router-dom";
import DiscordButton from "./DiscordButton";
import { useTranslation } from "react-i18next";
import { getStoredItem } from "../functions/services";
import { supportedLanguages } from "../config/languages";

const Menu = ({ setRedirectTo, openLanguajeModal, language }) => {
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();

  const getLanguageFlag = (lng) => {
    if (!lng) {
      return "/img/en.jpg";
    }

    const lngFound = supportedLanguages.find((l) => lng.includes(l.key));
    return lngFound ? `/img/${lngFound.key}.jpg` : "/img/en.jpg";
  };

  const searchItem = () => {
    setRedirectTo?.(`/wiki?s=${searchText}`);
    setSearchText("");
  };

  const handleKeyPress = (e) => {
    const keyPress = e.key || e.keyCode;
    if (keyPress === 13 || keyPress === "Enter") {
      searchItem();
    }
  };

  return (
    <header className="bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between py-2">
          <Link to="/" className="flex items-center space-x-2 text-white">
            <span className="text-xl font-bold">Stiletto</span>
            <img
              width="35"
              height="35"
              alt="Stiletto Logo"
              className="align-top"
              src="/img/icon-01.png"
            />
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white hover:bg-gray-700 rounded-lg"
            type="button"
            onClick={() => {
              const menu = document.getElementById('navbar-main-menu');
              menu.classList.toggle('hidden');
            }}
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

          {/* Navigation menu */}
          <div id="navbar-main-menu" className="hidden md:flex md:items-center w-full md:justify-around">
            <ul className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
              <li className="nav-item" data-cy="crafter-link">
                <Link to="/crafter" className="block py-2 text-white hover:text-gray-300">
                  {t("Crafting")}
                </Link>
              </li>
              <li className="nav-item" data-cy="maps-link">
                <Link
                  to={getStoredItem("token") != null ? "/maps" : "/map"}
                  className="block py-2 text-white hover:text-gray-300"
                >
                  {t("Resource Maps")}
                </Link>
              </li>
              <li className="nav-item" data-cy="clanlist-link">
                <Link to="/clanlist" className="block py-2 text-white hover:text-gray-300">
                  {t("Clan List")}
                </Link>
              </li>
              <li className="nav-item" data-cy="trades-link">
                <Link to="/trades" className="block py-2 text-white hover:text-gray-300">
                  {t("Trades")}
                </Link>
              </li>
              <li className="nav-item" data-cy="wiki-link">
                <Link to="/wiki" className="block py-2 text-white hover:text-gray-300">
                  {t("Wiki")}
                </Link>
              </li>
            </ul>

            {/* Search bar */}
            <div className="flex items-center mt-4 md:mt-0 flex-wrap md:flex-nowrap gap-y-1 gap-x-2">
              <div className="relative">
                <input
                  type="search"
                  className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder={t("Search items")}
                  aria-label={t("Search items")}
                  onChange={(e) => setSearchText(e.currentTarget.value)}
                  onKeyPress={handleKeyPress}
                  value={searchText}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  onClick={searchItem}
                >
                  <i className="fa fa-search" />
                </button>
              </div>

              {/* Language selector */}
              <button
                type="button"
                className="p-2 text-white hover:bg-gray-700 rounded-lg"
                data-cy="change-languaje-btn"
                aria-label="Change language"
                onClick={openLanguajeModal}
              >
                <img
                  className="rounded"
                  width="39"
                  height="25"
                  src={getLanguageFlag(language)}
                  alt="Change language"
                />
              </button>

              {/* Discord button */}
              <DiscordButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Menu;
