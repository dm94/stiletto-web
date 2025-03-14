"use client";

import { useTranslations } from "next-intl";
import type { Item } from "@/types/items";
import Icon from "@/components/Icon";

interface TotalMaterialsProps {
  selectedItems: Item[];
}

interface MaterialCount {
  name: string;
  count: number;
}

export const TotalMaterials = ({ selectedItems }: TotalMaterialsProps) => {
  const t = useTranslations();

  const calculateTotalMaterials = (): MaterialCount[] => {
    const materials: { [key: string]: number } = {};

    selectedItems.forEach((item) => {
      if (!item.crafting?.[0]?.ingredients) return;

      const count = item.count || 1;
      const ingredients = item.crafting[0].ingredients;

      ingredients.forEach((ingredient) => {
        const ingredientCount = (ingredient.count || 1) * count;
        materials[ingredient.name] =
          (materials[ingredient.name] || 0) + ingredientCount;
      });
    });

    return Object.entries(materials).map(([name, count]) => ({
      name,
      count,
    }));
  };

  const totalMaterials = calculateTotalMaterials();

  if (totalMaterials.length === 0) {
    return null;
  }

  return (
    <div className="card border-secondary mb-3">
      <div className="card-header">{t("Total Materials")}</div>
      <div className="card-body">
        <ul className="list-group">
          {totalMaterials.map((material) => (
            <li
              key={material.name}
              className="list-group-item d-flex justify-between items-center"
            >
              <div className="flex items-center">
                <Icon name={material.name} />
                <span className="ml-2">{t(material.name)}</span>
              </div>
              <span className="badge badge-primary badge-pill">
                {material.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TotalMaterials;
