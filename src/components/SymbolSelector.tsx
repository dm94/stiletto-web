import type React from "react";
import { config } from "../config/config";

interface SymbolSelectorProps {
  selectedSymbol: string;
  onChange: (symbol: string) => void;
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({
  selectedSymbol,
  onChange,
}) => {
  const renderSymbolsList = (): React.ReactNode => {
    const symbols = Array.from({ length: 30 }, (_, i) => `C${i + 1}`);

    return symbols.map((symbol) => {
      const isSelected = symbol === selectedSymbol;
      return (
        <button
          type="button"
          className={`col-3 p-1 rounded relative ${isSelected ? "bg-blue-600 ring-2 ring-blue-400 ring-opacity-100" : "hover:bg-gray-700"}`}
          key={`symbol-${symbol}`}
          onClick={() => onChange(symbol)}
          aria-pressed={isSelected}
          title={`${isSelected ? "Selected: " : ""}Clan symbol ${symbol}`}
        >
          <img
            src={`${config.REACT_APP_RESOURCES_URL}/symbols/${symbol}.png`}
            className="img-fluid"
            alt={`Clan symbol ${symbol}`}
            id={`symbol-img-${symbol}`}
          />
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute inset-0 border-2 border-white border-opacity-60 rounded" />
            </div>
          )}
        </button>
      );
    });
  };

  return (
    <div className="grid grid-cols-4 gap-2 justify-items-center">
      {renderSymbolsList()}
    </div>
  );
};

export default SymbolSelector;
