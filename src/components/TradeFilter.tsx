"use client";

import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";

interface TradeFilterProps {
  onFilterChange: (filters: (prev: TradeFilters) => TradeFilters) => void;
  regions: string[];
  items: Array<{ id: string; name: string }>;
}

export interface TradeFilters {
  type: "all" | "buy" | "sell";
  region: string;
  itemName: string;
}

export default function TradeFilter({
  onFilterChange,
  regions,
  items,
}: TradeFilterProps) {
  const t = useTranslations();

  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    onFilterChange((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title mb-0">{t("Filter Trades")}</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="type" className="form-label">
              {t("Type")}
            </label>
            <select
              id="type"
              name="type"
              className="form-select"
              onChange={handleFilterChange}
            >
              <option value="all">{t("All")}</option>
              <option value="buy">{t("Buy")}</option>
              <option value="sell">{t("Sell")}</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="region" className="form-label">
              {t("Region")}
            </label>
            <select
              id="region"
              name="region"
              className="form-select"
              onChange={handleFilterChange}
            >
              <option value="">{t("All Regions")}</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="itemName" className="form-label">
              {t("Item Name")}
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              className="form-control"
              placeholder={t("Search by item name")}
              onChange={handleFilterChange}
              list="items-list"
            />
            <datalist id="items-list">
              {items.map((item) => (
                <option key={item.id} value={t(item.name)} />
              ))}
            </datalist>
          </div>
        </div>
      </div>
    </div>
  );
}
