import type React from "react";
import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router";
import DiscordButton from "./DiscordButton";
import { useTranslation } from "react-i18next";
import { useUser } from "@store/userStore";
import { supportedLanguages } from "@config/languages";
import type { Language } from "@ctypes";

interface MenuProps {
  setRedirectTo?: (url: string) => void;
  openLanguajeModal?: () => void;
  language?: string;
}

const Menu: React.FC<MenuProps> = ({
  setRedirectTo,
  openLanguajeModal,
  language,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const { t } = useTranslation();
  const { isConnected } = useUser();

  const closeMenu = (): void => {
    const menu = document.getElementById("navbar-main-menu");
    if (menu && !menu.classList.contains("hidden") && window.innerWidth < 768) {
      menu.classList.add("hidden");
    }
  };

  const getLanguageFlag = (lng?: string): string => {
    if (!lng) {
      return "/img/en.jpg";
    }

    const lngFound = supportedLanguages.find((l: Language) =>
      lng.includes(l.key),
    );
    return lngFound ? `/img/${lngFound.key}.jpg` : "/img/en.jpg";
  };

  const searchItem = (): void => {
    setRedirectTo?.(`/wiki?s=${searchText}`);
    setSearchText("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    const keyPress = e.key;
    if (keyPress === "Enter") {
      searchItem();
    }
  };

  return (
    <header className="bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between py-2">
          <Link
            to="/"
            className="flex items-center space-x-2 text-white"
            onClick={closeMenu}
          >
            <span className="text-2xl font-medium web-title">Stiletto</span>
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
              const menu = document.getElementById("navbar-main-menu");
              menu?.classList.toggle("hidden");
            }}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              focusable="false"
            >
              <title>{t("common.menu")}</title>
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
          <div
            id="navbar-main-menu"
            className="hidden md:flex md:items-center w-full md:justify-around"
          >
            <ul className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
              <li className="nav-item" data-cy="crafter-link">
                <Link
                  to="/crafter"
                  className="block py-2 text-white hover:text-gray-300"
                  onClick={closeMenu}
                >
                  {t("menu.crafting")}
                </Link>
              </li>
              <li className="nav-item" data-cy="maps-link">
                <Link
                  to={isConnected ? "/maps" : "/map"}
                  className="block py-2 text-white hover:text-gray-300"
                  onClick={closeMenu}
                >
                  {t("menu.resourceMaps")}
                </Link>
              </li>
              <li className="nav-item" data-cy="clanlist-link">
                <Link
                  to="/clanlist"
                  className="block py-2 text-white hover:text-gray-300"
                  onClick={closeMenu}
                >
                  {t("menu.clanList")}
                </Link>
              </li>
              <li className="nav-item" data-cy="trades-link">
                <Link
                  to="/trades"
                  className="block py-2 text-white hover:text-gray-300"
                  onClick={closeMenu}
                >
                  {t("menu.trades")}
                </Link>
              </li>
              <li className="nav-item" data-cy="wiki-link">
                <Link
                  to="/wiki"
                  className="block py-2 text-white hover:text-gray-300"
                  onClick={closeMenu}
                >
                  {t("menu.wiki")}
                </Link>
              </li>
              <li className="nav-item" data-cy="tech-link">
                <Link
                  to="/tech"
                  className="block py-2 text-white hover:text-gray-300"
                  onClick={closeMenu}
                >
                  {t("menu.techTree")}
                </Link>
              </li>
            </ul>

            {/* Search bar */}
            <div className="flex items-center mt-4 md:mt-0 flex-wrap md:flex-nowrap gap-y-1 gap-x-2">
              <div className="relative">
                <input
                  type="search"
                  className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder={t("common.search")}
                  aria-label={t("common.search")}
                  onChange={(e) => setSearchText(e.currentTarget.value)}
                  onKeyDown={handleKeyPress}
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
                aria-label={t("settings.changeLanguage")}
                onClick={openLanguajeModal}
              >
                <img
                  className="rounded"
                  width="39"
                  height="25"
                  src={getLanguageFlag(language)}
                  alt={t("settings.changeLanguage")}
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
