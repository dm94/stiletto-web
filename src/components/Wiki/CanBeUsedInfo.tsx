import type React from "react";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import Ingredient from "../Ingredient";
import type { Item } from "@ctypes/item";

interface CanBeUsedInfoProps {
  name: string;
  items: Item[];
}

const CanBeUsedInfo: React.FC<CanBeUsedInfoProps> = ({ name, items = [] }) => {
  const ITEMS_PER_PAGE = 10;
  const { t } = useTranslation();
  const [canBeUsed, setCanBeUsed] = useState<Item[]>([]);
  const [visibleItems, setVisibleItems] = useState<number>(ITEMS_PER_PAGE);

  useEffect(() => {
    if (items && name) {
      const lowerCaseName = name?.toLowerCase();
      const filteredItems = items.filter((item) => {
        if (item?.crafting?.[0]?.ingredients) {
          const allIngredients = item.crafting[0].ingredients;
          return allIngredients.some(
            (ingredient) => ingredient.name.toLowerCase() === lowerCaseName,
          );
        }
        return false;
      });
      setCanBeUsed(filteredItems);
      setVisibleItems(ITEMS_PER_PAGE);
    }
  }, [name, items]);

  const loadMoreItems = useCallback(() => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + ITEMS_PER_PAGE);
  }, []);

  const visibleCanBeUsedItems = useMemo(() => {
    return canBeUsed.slice(0, visibleItems).map((item) => (
      <li
        className="relative p-2 rounded-lg bg-gray-700 shadow-md hover:shadow-lg border border-gray-600 hover:border-gray-500"
        key={`${item.name}-ingredient`}
      >
        <Ingredient
          ingredient={{
            ...item,
            count: 1,
          }}
          value={1}
        />
      </li>
    ));
  }, [canBeUsed, visibleItems]);

  const showMoreButton = useMemo(() => {
    if (canBeUsed.length > visibleItems) {
      return (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={loadMoreItems}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {t("common.showMore")}
          </button>
        </div>
      );
    }
    return null;
  }, [canBeUsed.length, visibleItems, loadMoreItems, t]);

  if (name && items && canBeUsed.length > 0) {
    return (
      <div className="w-full md:w-1/2 px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300 font-medium">
            {t("crafting.usedIn")}
          </div>
          <div className="p-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleCanBeUsedItems}
            </ul>
            {showMoreButton}
          </div>
        </div>
      </div>
    );
  }

  return false;
};

export default memo(CanBeUsedInfo);
