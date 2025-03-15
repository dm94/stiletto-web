import React, { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { getItems } from "../functions/services";
import { Navigate, useParams } from "react-router";
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

const WikiDescription = React.lazy(
  () => import("../components/Wiki/WikiDescription"),
);
const SchematicDropInfo = React.lazy(
  () => import("../components/Wiki/SchematicDropInfo"),
);
const DropsInfo = React.lazy(() => import("../components/Wiki/DropsInfo"));
const CanBeUsedInfo = React.lazy(
  () => import("../components/Wiki/CanBeUsedInfo"),
);
const SchematicItems = React.lazy(
  () => import("../components/Wiki/SchematicItems"),
);

const ItemWiki = () => {
  const { t } = useTranslation();
  const { name } = useParams();
  const [item, setItem] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [rarity, setRarity] = useState("Common");
  const [textColor, setTextColor] = useState("text-gray-400");

  useEffect(() => {
    const loadData = async () => {
      let itemName = name;
      if (name) {
        itemName = decodeURI(itemName).replaceAll("_", " ").toLowerCase();
      }

      const items = await getItems();
      if (items) {
        const foundItem = items.find(
          (it) => it.name.toLowerCase() === itemName,
        );
        setItem(foundItem);
        setAllItems(items);
        setIsLoaded(true);
      }
    };

    loadData();
  }, [ name ]);

  const showIngredient = (ingre) =>
    ingre?.crafting?.map((ingredients, index) => (
      <div
        className={
          ingre.crafting.length > 1
            ? "w-full lg:w-1/2 border border-gray-700"
            : "w-full"
        }
        key={`ingredients-${index}-${ingre.name}`}
      >
        <Ingredients crafting={ingredients} value={1} />
        {ingredients.station && <Station name={ingredients.station} />}
        {ingredients.time && <CraftingTime time={ingredients.time} />}
      </div>
    ));

  const showDescription = () =>
    item?.description && (
      <div className="w-full md:w-1/2">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
          <div className="p-4 bg-gray-900 border-b border-gray-700">
            {t("Description")}
          </div>
          <div className="p-4">{item.description}</div>
        </div>
      </div>
    );

  const updateRarity = (value) => {
    setRarity(value);

    switch (value) {
      case "Common":
        setTextColor("text-gray-400");
        break;
      case "Uncommon":
        setTextColor("text-green-400");
        break;
      case "Rare":
        setTextColor("text-blue-400");
        break;
      case "Epic":
        setTextColor("text-red-400");
        break;
      default:
        setTextColor("text-yellow-400");
    }
  };

  const getRarityClass = (value) => {
    let outlineColor = "";
    let hoverColor = "";
    let focusColor = "";

    switch (value) {
      case "Legendary":
        outlineColor = "border-yellow-500";
        hoverColor = "hover:bg-yellow-500";
        focusColor = "focus:ring-yellow-500";
        break;
      case "Epic":
        outlineColor = "border-red-500";
        hoverColor = "hover:bg-red-500";
        focusColor = "focus:ring-red-500";
        break;
      case "Rare":
        outlineColor = "border-blue-500";
        hoverColor = "hover:bg-blue-500";
        focusColor = "focus:ring-blue-500";
        break;
      case "Uncommon":
        outlineColor = "border-green-500";
        hoverColor = "hover:bg-green-500";
        focusColor = "focus:ring-green-500";
        break;
      default:
        outlineColor = "border-gray-500";
        hoverColor = "hover:bg-gray-500";
        focusColor = "focus:ring-gray-500";
    }

    return `px-4 py-2 border rounded-lg text-gray-300 ${outlineColor} ${hoverColor} focus:outline-none focus:ring-2 ${focusColor} ${
      rarity === value ? "bg-opacity-20" : ""
    }`;
  };

  const loadingItemPart = () => (
    <div className="w-full md:w-1/2">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
        <LoadingPart />
      </div>
    </div>
  );

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!item) {
    return <Navigate to={"/not-found"} />;
  }

  const itemName = item?.name;
  const parentUrl = item.parent && getItemUrl(item.parent);
  const craftUrl = getItemCraftUrl(name);

  return (
    <div
      className="container mx-auto px-4"
      data-cy="wiki-item"
      data-name={itemName}
    >
      <HeaderMeta
        title={`${itemName} - Stiletto for Last Oasis`}
        description={`All information for ${itemName}`}
        cannonical={getItemUrl(itemName)}
      />
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
            <div className="p-4 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center text-neutral-300">
                <Icon key={itemName} name={itemName} width={35} />
                <span className="ml-2">{t(itemName, { ns: "items" })}</span>
              </div>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {item?.cost && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("Cost to learn")}</div>
                    <div className="text-gray-400">
                      {`${item?.cost?.count ? item.cost.count : ""} ${
                        item?.cost?.name ? t(item?.cost?.name) : ""
                      }`}
                    </div>
                  </li>
                )}
                {item?.category && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("Category")}</div>
                    <div className="text-gray-400">
                      {t(item.category, { ns: "items" })}
                    </div>
                  </li>
                )}
                {item?.parent && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("Parent")}</div>
                    <div className="text-gray-400">
                      <a href={parentUrl} className="hover:text-blue-400">
                        {t(item.parent, { ns: "items" })}
                      </a>
                    </div>
                  </li>
                )}
                {item?.trade_price && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("Trade Price")}</div>
                    <div className="text-gray-400">
                      {item.trade_price} flots
                    </div>
                  </li>
                )}
                {item?.stackSize && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("Character Stack")}</div>
                    <div className="text-gray-400">{item.stackSize}</div>
                  </li>
                )}
                {item?.weight && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("Weight")}</div>
                    <div className={textColor}>
                      {calcRarityValue(
                        rarity,
                        "weight",
                        item.category,
                        item.weight,
                      )}
                    </div>
                  </li>
                )}
                {item?.experiencieReward && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">
                      {t("Experience by crafting")}
                    </div>
                    <div className="text-gray-400">
                      {item.experiencieReward}
                    </div>
                  </li>
                )}
                {item?.durability && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("Durability")}</div>
                    <div className={textColor}>
                      {calcRarityValue(
                        rarity,
                        "durability",
                        item.category,
                        item.durability,
                      )}
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <div className="p-4 bg-gray-900 border-t border-gray-700 text-center">
              <fieldset
                className="inline-flex rounded-lg shadow-sm"
                aria-label="Rarities"
              >
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
                  ),
                )}
              </fieldset>
            </div>
          </div>
        </div>
        {item.crafting && (
          <div className="w-full lg:w-1/2 px-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
              <div className="p-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
                <span className="text-neutral-300">{t("Recipe")}</span>
                <a
                  href={craftUrl}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <i className="fas fa-tools" />
                </a>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap -mx-2">
                  {showIngredient(item)}
                </div>
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
          <WikiDescription key="wikidescription" name={itemName} />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <CanBeUsedInfo
            key="CanBeUsedInfo"
            name={itemName}
            items={allItems}
          />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <DropsInfo key="dropInfo" drops={item.drops} />
        </Suspense>
        <Comments key="comments" name={itemName} />
      </div>
    </div>
  );
};

export default ItemWiki;
