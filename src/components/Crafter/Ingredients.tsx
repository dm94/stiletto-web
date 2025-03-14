"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { CraftingRecipe } from "@/types/item";

interface IngredientsProps {
  crafting: CraftingRecipe;
  value: number;
}

export default function Ingredients({ crafting, value }: IngredientsProps) {
  const t = useTranslations();

  return (
    <div className="space-y-2">
      {crafting.ingredients.map((ingredient) => (
        <div
          key={ingredient.name}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <Image
              src={`/img/items/${ingredient.name
                .toLowerCase()
                .replace(/ /g, "_")}.png`}
              alt={t(ingredient.name, { ns: "items" })}
              width={24}
              height={24}
              className="rounded-sm"
            />
            <Link
              href={`/item/${encodeURIComponent(
                ingredient.name.replace(/ /g, "_")
              )}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t(ingredient.name, { ns: "items" })}
            </Link>
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            {Math.ceil(ingredient.amount * value)}
          </span>
        </div>
      ))}
    </div>
  );
}
