import type React from "react";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ListIngredients from "./ListIngredients";
import Icon from "../Icon";
import { AnalyticsEvent, sendEvent } from "@functions/page-tracking";
import { sendNotification } from "@functions/broadcast";
import { getDomain, getItemUrl } from "@functions/utils";
import { addRecipe } from "@functions/requests/recipes";
import type { CraftItem, ItemIngredient } from "@ctypes/item";
import type { Recipe } from "@ctypes/dto/recipe";

interface TotalMaterialsProps {
  selectedItems: CraftItem[];
}

const TotalMaterials: React.FC<TotalMaterialsProps> = memo(
  ({ selectedItems }) => {
    const [recipeToken, setRecipeToken] = useState("");
    const { t } = useTranslation();

    const addRecipeRequest = useCallback(async (): Promise<void> => {
      sendEvent(AnalyticsEvent.SHARE, {
        props: {
          action: "addRecipe",
        },
      });

      try {
        const items: Recipe[] = selectedItems?.map((item) => ({
          name: item.name,
          count: item.count,
        }));

        const response = await addRecipe(items);
        if (response) {
          sendNotification("notification.share", "Information");
          setRecipeToken(response.token);
        }
      } catch {
        sendNotification("errors.apiConnection", "Error");
      }
    }, [selectedItems]);

    const shareButton = useCallback(
      (): React.ReactElement => (
        <button
          type="button"
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={addRecipeRequest}
          title={t("crafting.generateShareLink")}
          data-cy="share-crafter-btn"
          disabled={selectedItems?.length <= 0}
        >
          <i className="fas fa-share-alt" /> {t("common.share")}
        </button>
      ),
      [addRecipeRequest, selectedItems, t],
    );

    const footerPart = useCallback((): React.ReactElement => {
      if (recipeToken.length > 0) {
        const url = `${getDomain()}/crafter?recipe=${recipeToken}`;
        return (
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-cy="share-crafter-input"
              value={url}
              disabled
            />
            <button
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
              onClick={() => navigator.clipboard.writeText(url)}
            >
              {t("common.copy")}
            </button>
            {shareButton()}
          </div>
        );
      }
      return shareButton();
    }, [recipeToken, shareButton, t]);

    const itemsList = useMemo((): React.ReactElement[] => {
      return selectedItems?.map((item) => (
        <li
          className="inline-flex items-center mr-2 text-neutral-300"
          key={`itemsList-${item.name}`}
        >
          <Icon key={item.name} name={item.name} /> {`${item.count}x `}
          <a
            href={getItemUrl(item.name)}
            className="text-blue-400 hover:text-blue-300"
          >
            {`${t(item.name, { ns: "items" })} - `}
          </a>
        </li>
      ));
    }, [selectedItems, t]);

    const calculateTotalIngredients = useMemo(() => {
      const totalIngredients: Array<{
        name: string;
        count: number;
        ingredients?: ItemIngredient[];
      }> = [];

      for (const item of selectedItems ?? []) {
        if (item?.crafting?.[0]?.ingredients != null) {
          const output = item.crafting[0].output ?? 1;
          for (const ingredient of item.crafting[0].ingredients) {
            const existingIngredient = totalIngredients.find(
              (ingre) => ingre.name === ingredient.name,
            );
            if (existingIngredient) {
              existingIngredient.count +=
                (ingredient.count / output) * item.count;
            } else {
              totalIngredients.push({
                name: ingredient.name,
                count: (ingredient.count / output) * item.count,
                ingredients: ingredient.ingredients,
              });
            }
          }
        }
      }

      return totalIngredients;
    }, [selectedItems]);

    const copyMaterials = useCallback((): void => {
      sendEvent(AnalyticsEvent.SHARE, {
        props: {
          action: "copyMaterials",
        },
      });

      let text = `${t("crafting.toMake")}:\n\n`;

      for (const item of selectedItems ?? []) {
        text += `${item.count}x ${t(item.name, { ns: "items" })} - `;
      }

      text += `\n\n${t("crafting.youNeedMaterials")}:\n\n`;

      for (const ingredient of calculateTotalIngredients) {
        text += `\t${ingredient.count}x ${t(ingredient.name)}\n`;
      }

      text += `\n${t("crafting.listOfMaterials")} ${getDomain()}`;

      navigator.clipboard.writeText(text);
      sendNotification("common.itemsCopiedToClipboard", "common.information");
    }, [selectedItems, t, calculateTotalIngredients]);

    return (
      <div className="bg-gray-800 border border-yellow-500 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-yellow-500 flex justify-between items-center">
          <div className="font-normal text-gray-300">
            {t("crafting.totalMaterials")}
          </div>
          <button
            type="button"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={t("common.copyToClipboard")}
            data-cy="crafter-copy-clipboard"
            onClick={copyMaterials}
            disabled={selectedItems?.length <= 0}
          >
            <i className="fas fa-copy" />
          </button>
        </div>
        <div className="p-4" id="list-all-items">
          <ul className="flex flex-wrap gap-2 mb-4">{itemsList}</ul>
          <div>
            <ListIngredients selectedItems={selectedItems} />
            <div className="text-right text-gray-400">
              {t("crafting.listOfMaterials")} {getDomain()}
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-900 border-t border-gray-700">
          {footerPart()}
        </div>
      </div>
    );
  },
);

export default TotalMaterials;
