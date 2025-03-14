"use client";

import { useTranslations } from "next-intl";
import type { Item } from "@/types/items";
import Icon from "@/components/Icon";

interface ItemsProps {
  items: Item[];
  onAdd: (itemName: string, count?: number) => void;
}

export const Items = ({ items, onAdd }: ItemsProps) => {
  const t = useTranslations();

  return (
    <div className="list-group">
      {items.map((item) => (
        <button
          key={item.name}
          type="button"
          className="list-group-item list-group-item-action d-flex justify-between items-center"
          onClick={() => onAdd(item.name)}
        >
          <div className="flex items-center">
            <Icon name={item.name} />
            <span className="ml-2">{t(item.name)}</span>
          </div>
          {item.category && (
            <small className="text-muted">{t(item.category)}</small>
          )}
        </button>
      ))}
    </div>
  );
};

export default Items;
