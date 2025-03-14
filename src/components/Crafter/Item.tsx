"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import type { ItemData } from "@/types/item";

interface ItemProps {
  item: ItemData;
  onSelect: (item: ItemData) => void;
}

export default function Item({ item, onSelect }: ItemProps) {
  const t = useTranslations();

  return (
    <button
      type="button"
      className="w-full px-4 py-2 flex items-center space-x-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      onClick={() => onSelect(item)}
    >
      <Image
        src={item.icon}
        alt={t(item.name, { ns: "items" })}
        width={32}
        height={32}
        className="rounded-md"
      />
      <div className="flex-1 text-left">
        <div className="text-gray-900 dark:text-white">
          {t(item.name, { ns: "items" })}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t(item.category)}
        </div>
      </div>
    </button>
  );
}
