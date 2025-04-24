import type React from "react";
import { useTranslation } from "react-i18next";

type CategoryFilterProps = {
  categories: string[];
  categoryFilter: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const CategoryFilter = ({
  categories,
  categoryFilter,
  onCategoryChange,
}: CategoryFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 border-t border-gray-700 bg-gray-850">
      <div className="max-w-md mx-auto">
        <div className="flex">
          <label
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-l-lg text-gray-300"
            htmlFor="category-filter"
          >
            {t("wiki.filterByCategory")}
          </label>
          <select
            id="category-filter"
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-r-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={onCategoryChange}
          >
            <option key="all" value="All">
              {t("common.all")}
            </option>
            {categories.map((category) => (
              <option key={`option-${category}`} value={category}>
                {t(category)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
