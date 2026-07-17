import type React from "react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type SearchBarProps = {
  searchText: string;
  onSearchTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
};

const SearchBar = ({
  searchText,
  onSearchTextChange,
  onKeyPress,
  onSearchClick,
}: SearchBarProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        const active = document.activeElement;
        const isEditing =
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.tagName === "SELECT" ||
            active.getAttribute("contenteditable") === "true");

        if (!isEditing) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="flex relative items-center"
        itemProp="potentialAction"
        data-testid="wiki-search"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="search"
            className="w-full pl-4 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-l-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("common.search")}
            aria-label={t("common.search")}
            onChange={onSearchTextChange}
            onKeyDown={onKeyPress}
            value={searchText}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-gray-400 bg-gray-800 border border-gray-600 rounded pointer-events-none select-none">
            /
          </kbd>
        </div>
        <button
          type="button"
          className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          onClick={onSearchClick}
        >
          {t("common.search")}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
