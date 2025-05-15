import type React from "react";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import type { Item as ItemType } from "@ctypes/item";

interface ItemProps {
  item: ItemType | null;
  onAdd: (name: string) => void;
}

const Item: React.FC<ItemProps> = memo(({ item, onAdd }) => {
  const { t } = useTranslation();

  if (!item) {
    return null;
  }

  return (
    <div
      className="p-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
      data-testid="list-group-item"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-300">{t(item?.name, { ns: "items" })}</span>
        <button
          type="button"
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label={t("common.addItem")}
          onClick={() => onAdd(item?.name)}
        >
          <i className="fas fa-plus" />
        </button>
      </div>
    </div>
  );
});

export default Item;
