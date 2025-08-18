import type React from "react";
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

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="flex"
        itemProp="potentialAction"
        data-testid="wiki-search"
      >
        <input
          type="search"
          className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg text-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          placeholder={t("common.search")}
          aria-label={t("common.search")}
          onChange={onSearchTextChange}
          onKeyDown={onKeyPress}
          value={searchText}
        />
        <button
          type="button"
          className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          onClick={onSearchClick}
        >
          {t("common.search")}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
