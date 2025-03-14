"use client";

import { useTranslations } from "next-intl";
import type { Item } from "@/types/items";
import Icon from "@/components/Icon";

interface SelectedItemProps {
  item: Item;
  value: number;
  onChangeCount: (itemName: string, count: number) => void;
}

export const SelectedItem = ({
  item,
  value,
  onChangeCount,
}: SelectedItemProps) => {
  const t = useTranslations();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.currentTarget.value) || 0;
    onChangeCount(item.name, newValue);
  };

  const handleIncrement = () => {
    onChangeCount(item.name, value + 1);
  };

  const handleDecrement = () => {
    onChangeCount(item.name, value - 1);
  };

  return (
    <div className="card border-secondary mb-3">
      <div className="card-header d-flex justify-between items-center">
        <div className="flex items-center">
          <Icon name={item.name} />
          <span className="ml-2">{t(item.name)}</span>
        </div>
        {item.category && (
          <small className="text-muted">{t(item.category)}</small>
        )}
      </div>
      <div className="card-body">
        <div className="input-group">
          <div className="input-group-prepend">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleDecrement}
            >
              -
            </button>
          </div>
          <input
            type="number"
            className="form-control text-center"
            value={value}
            onChange={handleInputChange}
            min="0"
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedItem;
