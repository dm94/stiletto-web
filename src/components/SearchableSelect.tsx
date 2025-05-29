import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface SearchableSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = "",
  className = "",
  "data-testid": dataCy,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the search input
  const triggerRef = useRef<HTMLDivElement>(null); // Ref for the trigger div

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

    const handleKeyDownGlobal = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus(); // Return focus to the trigger
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDownGlobal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDownGlobal);
    };
  }, [isOpen]); // Added isOpen to dependencies

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
        ref={triggerRef} // Added ref to the trigger
        className={`w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
          // Removed Escape key handling from here, will be handled globally for the dropdown
        }}
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-select`} 
        aria-label={placeholder}
        tabIndex={0}
        data-testid={dataCy}
      >
        <span>{selectedLabel ?? placeholder}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {isOpen && (
        <div
          id={`${id}-options`}
          className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="p-2 sticky top-0 bg-gray-700 border-b border-gray-600">
            <input
              ref={inputRef} // Added ref to the search input
              id={`${id}-search-input`} // Ensure unique ID if `id` is used elsewhere
              type="text"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("common.search")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking input
              aria-label={t("common.search")}
            />
          </div>
          {filteredOptions.length > 0 ? (
            <select
              className="w-full bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 p-2"
              size={Math.min(filteredOptions.length, 8)}
              value={value}
              onChange={(e) => handleOptionClick(e.target.value)}
              aria-labelledby={id}
              id={`${id}-select`}
            >
              {filteredOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className={`p-2 hover:bg-gray-600 hover:text-white ${
                    option.value === value ? "bg-blue-600" : ""
                  }`}
                >
                  {option.label}
                </option>
              ))}
            </select>
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
