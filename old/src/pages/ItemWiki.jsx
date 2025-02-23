import React, { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { getItems } from "../functions/services";
import { Redirect } from "react-router-dom";
import Ingredients from "../components/Ingredients";
import Station from "../components/Station";
import Icon from "../components/Icon";
import CraftingTime from "../components/CraftingTime";
import LoadingScreen from "../components/LoadingScreen";
import LoadingPart from "../components/LoadingPart";
import ModuleInfo from "../components/Wiki/ModuleInfo";
import ToolInfo from "../components/Wiki/ToolInfo";
import GenericInfo from "../components/Wiki/GenericInfo";
import Comments from "../components/Wiki/Comments";
import { calcRarityValue } from "../rarityCalc";
import { getItemUrl, getItemCraftUrl } from "../functions/utils";
import HeaderMeta from "../components/HeaderMeta";

const WikiDescription = React.lazy(() =>
  import("../components/Wiki/WikiDescription")
);
const SchematicDropInfo = React.lazy(() =>
  import("../components/Wiki/SchematicDropInfo")
);
const DropsInfo = React.lazy(() => import("../components/Wiki/DropsInfo"));
const CanBeUsedInfo = React.lazy(() =>
  import("../components/Wiki/CanBeUsedInfo")
);
const SchematicItems = React.lazy(() =>
  import("../components/Wiki/SchematicItems")
);

const ItemWiki = ({ match }) => {
  const { t } = useTranslation();
  const [item, setItem] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [rarity, setRarity] = useState("Common");
  const [textColor, setTextColor] = useState("text-muted");

  useEffect(() => {
    const loadData = async () => {
      let itemName = match?.params?.name;
      if (itemName) {
        itemName = decodeURI(itemName).replaceAll("_", " ").toLowerCase();
      }

      const items = await getItems();
      if (items) {
        const foundItem = items.find(
          (it) => it.name.toLowerCase() === itemName
        );
        setItem(foundItem);
        setAllItems(items);
        setIsLoaded(true);
      }
    };

    loadData();
  }, [match]);

  const showIngredient = (ingre) =>
    ingre?.crafting?.map((ingredients, index) => (
      <div
        className={ingre.crafting.length > 1 ? "col-xl-6 border" : "col-xl-12"}
        key={`ingredients-${index}-${ingre.name}`}
      >
        <Ingredients crafting={ingredients} value={1} />
        {ingredients.station && <Station name={ingredients.station} />}
        {ingredients.time && <CraftingTime time={ingredients.time} />}
      </div>
    ));

  const showDescription = () =>
    item?.description && (
      <div className="col-12 col-md-6">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("Description")}</div>
          <div className="card-body">{item.description}</div>
        </div>
      </div>
    );

  const updateRarity = (value) => {
    setRarity(value);

    switch (value) {
      case "Common":
        setTextColor("text-muted");
        break;
      case "Uncommon":
        setTextColor("text-success");
        break;
      case "Rare":
        setTextColor("text-info");
        break;
      case "Epic":
        setTextColor("text-danger");
        break;
      default:
        setTextColor("text-warning");
    }
  };

  const getRarityClass = (value) => {
    let outlineColor = "";

    switch (value) {
      case "Legendary":
        outlineColor = "warning";
        break;
      case "Epic":
        outlineColor = "danger";
        break;
      case "Rare":
        outlineColor = "info";
        break;
      case "Uncommon":
        outlineColor = "success";
        break;
      default:
        outlineColor = "light";
    }

    return `btn btn-outline-${outlineColor} ${
      rarity === value ? "active" : ""
    }`;
  };

  const loadingItemPart = () => (
    <div className="col-12 col-md-6">
      <div className="card border-secondary mb-3">
        <LoadingPart />
      </div>
    </div>
  );

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!item) {
    return <Redirect to={"/not-found"} />;
  }

  const { name } = item;
  const parentUrl = item.parent && getItemUrl(item.parent);
  const craftUrl = getItemCraftUrl(name);

  return (
    <div className="container" data-cy="wiki-item" data-name={name}>
      <HeaderMeta
        title={`${name} - Stiletto for Last Oasis`}
        description={`All information for ${name}`}
        cannonical={getItemUrl(name)}
      />
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">
              <Icon key={name} name={name} width={35} />
              {t(name, { ns: "items" })}
            </div>
            <div className="card-body">
              <ul className="list-group mb-3">
                {item?.cost && (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Cost to learn")}</div>
                    <div className="text-muted">
                      {`${item?.cost?.count ? item.cost.count : ""} ${
                        item?.cost?.name ? t(item?.cost?.name) : ""
                      }`}
                    </div>
                  </li>
                )}
                {item?.category && (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Category")}</div>
                    <div className="text-muted">
                      {t(item.category, { ns: "items" })}
                    </div>
                  </li>
                )}
                {item?.parent && (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Parent")}</div>
                    <div className="text-muted">
                      <a href={parentUrl}>{t(item.parent, { ns: "items" })}</a>
                    </div>
                  </li>
                )}
                {item?.trade_price && (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Trade Price")}</div>
                    <div className="text-muted">{item.trade_price} flots</div>
                  </li>
                )}
                {item?.stackSize && (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Character Stack")}</div>
                    <div className="text-muted">{item.stackSize}</div>
                  </li>
                )}
                {item?.weight && (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Weight")}</div>
                    <div className={textColor}>
                      {calcRarityValue(
                        rarity,
                        "weight",
                        item.category,
                        item.weight
                      )}
                    </div>
                  </li>
                )}
                {item?.experiencieReward && (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Experience by crafting")}</div>
                    <div className="text-muted">{item.experiencieReward}</div>
                  </li>
                )}
                {item?.durability && (
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="my-0">{t("Durability")}</div>
                    <div className={textColor}>
                      {calcRarityValue(
                        rarity,
                        "durability",
                        item.category,
                        item.durability
                      )}
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <div className="card-footer text-center">
              <fieldset className="btn-group" aria-label="Rarities">
                {["Common", "Uncommon", "Rare", "Epic", "Legendary"].map(
                  (rar) => (
                    <button
                      key={rar}
                      type="button"
                      title={t(rar)}
                      className={getRarityClass(rar)}
                      onClick={() => updateRarity(rar)}
                    >
                      {rar[0]}
                    </button>
                  )
                )}
              </fieldset>
            </div>
          </div>
        </div>
        {item.crafting && (
          <div className="col-12 col-xl-6">
            <div className="card border-secondary mb-3">
              <div className="card-header">
                {t("Recipe")}{" "}
                <a href={craftUrl} className="float-right">
                  <i className="fas fa-tools" />
                </a>
              </div>
              <div className="card-body">
                <div className="row">{showIngredient(item)}</div>
              </div>
            </div>
          </div>
        )}
        <Suspense fallback={loadingItemPart()}>
          <SchematicItems key="schematicItems" item={item} />
        </Suspense>
        {showDescription()}
        {item?.structureInfo && (
          <GenericInfo
            key="structureInfo"
            name="Structure Info"
            dataInfo={item.structureInfo}
            rarity={rarity}
            textColor={textColor}
            category={item.category}
          />
        )}
        {item?.projectileDamage && (
          <GenericInfo
            key="proyectileInfo"
            name="Projectile Info"
            dataInfo={item.projectileDamage}
            rarity={rarity}
            textColor={textColor}
            category={item.category}
          />
        )}
        {item?.weaponInfo && (
          <GenericInfo
            key="weaponinfo"
            name="Weapon Info"
            dataInfo={item.weaponInfo}
            rarity={rarity}
            textColor={textColor}
            category={item.category}
          />
        )}
        {item?.armorInfo && (
          <GenericInfo
            key="armorinfo"
            name="Armor Info"
            dataInfo={item.armorInfo}
            rarity={rarity}
            textColor={textColor}
            category={item.category}
          />
        )}
        {item?.toolInfo && <ToolInfo key="toolinfo" toolInfo={item.toolInfo} />}
        {item?.moduleInfo && (
          <ModuleInfo key="moduleinfo" moduleInfo={item.moduleInfo} />
        )}
        <Suspense fallback={loadingItemPart()}>
          <SchematicDropInfo
            key="schematicInfo"
            name={item.name}
            items={allItems}
          />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <WikiDescription key="wikidescription" name={item.name} />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <CanBeUsedInfo
            key="CanBeUsedInfo"
            name={item.name}
            items={allItems}
          />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <DropsInfo key="dropInfo" drops={item.drops} />
        </Suspense>
        <Comments key="comments" name={item.name} />
      </div>
    </div>
  );
};

export default ItemWiki;
