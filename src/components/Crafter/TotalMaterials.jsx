import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ListIngredients from "./ListIngredients";
import Icon from "../Icon";
import { sendEvent } from "../../page-tracking";
import { sendNotification } from "../../functions/broadcast";
import { getDomain } from "../../functions/utils";
import { addRecipe } from "../../functions/requests/recipes";

const TotalMaterials = ({ selectedItems }) => {
  const [recipeToken, setRecipeToken] = useState("");
  const { t } = useTranslation();

  const addRecipeRequest = async () => {
    sendEvent("common.share", {
      props: {
        action: "addRecipe",
      },
    });

    try {
      const items = selectedItems?.map((item) => ({
        name: item.name,
        count: item.count,
      }));

      const response = await addRecipe(items);
      if (response.status === 201) {
        const data = await response.json();
        sendNotification(
          "notification.share",
          "common.information",
        );
        setRecipeToken(data.token);
      }
    } catch {
      sendNotification("errors.apiConnection", "common.error");
    }
  };

  const shareButton = () => (
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
  );

  const footerPart = () => {
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
  };

  const itemsList = () => {
    const url = `${getDomain()}/item/`;

    return selectedItems?.map((item) => (
      <li
        className="inline-flex items-center mr-2"
        key={`itemsList-${item.name}`}
      >
        <Icon key={item.name} name={item.name} /> {item.count}x{" "}
        <a
          href={url + encodeURI(item.name.replaceAll(" ", "_"))}
          className="text-blue-400 hover:text-blue-300"
        >
          {t(item.name, { ns: "items" })}
        </a>{" "}
        -
      </li>
    ));
  };

  const copyMaterials = () => {
    sendEvent("common.share", {
      props: {
        action: "copyMaterials",
      },
    });

    let text = `${t("crafting.toMake")}:\n\n`;

    for (const item of selectedItems ?? []) {
      text += `${item.count}x ${t(item.name, { ns: "items" })} - `;
    }

    text += `\n\n${t("crafting.youNeedMaterials")}:\n\n`;

    const totalIngredients = [];
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

    for (const ingredient of totalIngredients) {
      text += `\t${ingredient.count}x ${t(ingredient.name)}\n`;
    }

    text += `\n${t("crafting.listOfMaterialsBy")} ${getDomain()}`;

    navigator.clipboard.writeText(text);
    sendNotification("common.itemsCopiedToClipboard", "common.information");
  };

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
        <ul className="flex flex-wrap gap-2 mb-4">{itemsList()}</ul>
        <div>
          <ListIngredients selectedItems={selectedItems} />
          <div className="text-right text-gray-400">
            {t("crafting.listOfMaterialsBy")} {getDomain()}
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        {footerPart()}
      </div>
    </div>
  );
};

export default TotalMaterials;
