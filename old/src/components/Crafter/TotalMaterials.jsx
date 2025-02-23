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
    sendEvent("share", {
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
        sendNotification("Sharing code has been generated", "Information");
        setRecipeToken(data.token);
      }
    } catch {
      sendNotification("Error when connecting to the API", "Error");
    }
  };

  const shareButton = () => (
    <button
      type="button"
      className="btn btn-success float-right"
      onClick={addRecipeRequest}
      title={t("Generate a link to share it")}
      data-cy="share-crafter-btn"
      disabled={selectedItems?.length <= 0}
    >
      <i className="fas fa-share-alt" /> {t("Share")}
    </button>
  );

  const footerPart = () => {
    if (recipeToken.length > 0) {
      const url = `${getDomain()}/crafter?recipe=${recipeToken}`;
      return (
        <div className="input-group mb-3 float-left">
          <input
            type="text"
            className="form-control"
            data-cy="share-crafter-input"
            value={url}
            disabled
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => navigator.clipboard.writeText(url)}
            >
              {t("Copy")}
            </button>
            {shareButton()}
          </div>
        </div>
      );
    }
    return shareButton();
  };

  const itemsList = () => {
    const url = `${getDomain()}/item/`;

    return selectedItems?.map((item) => (
      <li className="list-inline-item" key={`itemsList-${item.name}`}>
        <Icon key={item.name} name={item.name} /> {item.count}x{" "}
        <a href={url + encodeURI(item.name.replaceAll(" ", "_"))}>
          {t(item.name, { ns: "items" })}
        </a>{" "}
        -
      </li>
    ));
  };

  const copyMaterials = () => {
    sendEvent("share", {
      props: {
        action: "copyMaterials",
      },
    });

    let text = `${t("To make")}:\n\n`;

    for (const item of selectedItems ?? []) {
      text += `${item.count}x ${t(item.name, { ns: "items" })} - `;
    }

    text += `\n\n${t("You need the following materials")}:\n\n`;

    const totalIngredients = [];
    for (const item of selectedItems ?? []) {
      if (item?.crafting?.[0]?.ingredients != null) {
        const output = item.crafting[0].output ?? 1;
        for (const ingredient of item.crafting[0].ingredients) {
          const existingIngredient = totalIngredients.find(
            (ingre) => ingre.name === ingredient.name
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

    text += `\n${t("List of all necessary materials by")} ${getDomain()}`;

    navigator.clipboard.writeText(text);
    sendNotification("Items copied to the clipboard", "Information");
  };

  return (
    <div className="card border-warning m-3">
      <div className="card-header border-warning">
        <button
          type="button"
          className="btn btn-sm btn-primary float-right"
          title={t("Copy to clipboard")}
          data-cy="crafter-copy-clipboard"
          onClick={copyMaterials}
          disabled={selectedItems?.length <= 0}
        >
          <i className="fas fa-copy" />
        </button>
        <div className="font-weight-normal">{t("Total materials")}</div>
      </div>
      <div className="card-body" id="list-all-items">
        <ul className="list-inline">{itemsList()}</ul>
        <div className="list-unstyled">
          <ListIngredients selectedItems={selectedItems} />
          <div className="text-right text-muted">
            {t("List of all necessary materials by")} {getDomain()}
          </div>
        </div>
      </div>
      <div className="card-footer">{footerPart()}</div>
    </div>
  );
};

export default TotalMaterials;
