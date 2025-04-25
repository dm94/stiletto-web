import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface SearchableSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  "data-cy"?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = "",
  className = "",
  "data-cy": dataCy,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredOptions(filtered);
    }
  }, [searchText, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchText("");
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className={`w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-options`}
        aria-label={placeholder}
        tabIndex={0}
        data-cy={dataCy}
      >
        <span>{selectedLabel || placeholder}</span>
        <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`} />
      </div>

      {isOpen && (
        <div
          id={`${id}-options`}
          className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="p-2 sticky top-0 bg-gray-700 border-b border-gray-600">
            <input
              id={id}
              type="text"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("common.search")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              aria-label={t("common.search")}
            />
          </div>
          {filteredOptions.length > 0 ? (
            <ul role="listbox" aria-labelledby={id}>
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`p-2 hover:bg-gray-600 hover:text-white hover:border-l-4 hover:border-blue-400 transition-all duration-150 cursor-pointer ${option.value === value ? "bg-blue-600" : ""}`}
                  onClick={() => handleOptionClick(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOptionClick(option.value);
                    }
                  }}
                  role="option"
                  aria-selected={option.value === value}
                  tabIndex={0}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-gray-400 text-center">
              {t("common.noResults")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
