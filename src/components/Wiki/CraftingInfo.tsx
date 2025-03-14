"use client";

import { useTranslations } from "next-intl";
import { Item } from "@/types/items";
import { Ingredient } from "@/components/Ingredient";

interface CraftingInfoProps {
  item: Item;
}

export const CraftingInfo = ({ item }: CraftingInfoProps) => {
  const t = useTranslations();

  if (!item?.crafting?.[0]?.ingredients) {
    return null;
  }

  const { ingredients, output = 1 } = item.crafting[0];

  const showIngredients = () => {
    return ingredients.map((ingredient) => (
      <li className="list-inline-item" key={ingredient.name}>
        <Ingredient
          key={`${ingredient.name}-ingredient`}
          ingredient={ingredient}
          value={ingredient.count || 1}
        />
      </li>
    ));
  };

  return (
    <div className="col-12 col-md-6">
      <div className="card border-secondary mb-3">
        <div className="card-header">{t("Crafting")}</div>
        <div className="card-body">
          <div className="mb-2">
            {item.craftingStation && (
              <div className="mb-2">
                <strong>{t("Crafting Station")}:</strong> {item.craftingStation}
              </div>
            )}
            {item.craftingTime && (
              <div className="mb-2">
                <strong>{t("Crafting Time")}:</strong> {item.craftingTime}s
              </div>
            )}
            {output > 1 && (
              <div className="mb-2">
                <strong>{t("Output")}:</strong> {output}
              </div>
            )}
          </div>
          <div>
            <strong>{t("Ingredients")}:</strong>
            <ul className="list-inline mt-2">{showIngredients()}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CraftingInfo;
