"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "next-i18next";
import { getItems } from "@functions/services";
import Ingredients from "@components/Ingredients";
import Station from "@components/Station";
import Icon from "@components/Icon";
import CraftingTime from "@components/CraftingTime";
import LoadingScreen from "@components/LoadingScreen";
import ModuleInfo from "@components/Wiki/ModuleInfo";
import ToolInfo from "@components/Wiki/ToolInfo";
import GenericInfo from "@components/Wiki/GenericInfo";
import Comments from "@components/Wiki/Comments";
import { calcRarityValue } from "@functions/rarityCalc";
import {
  getItemUrl,
  getItemCraftUrl,
  getItemDecodedName,
} from "@functions/utils";
import { type Item, Rarity } from "@ctypes/item";
import { useParams, useRouter } from "next/navigation";

const WikiDescription = React.lazy(
  () => import("@components/Wiki/WikiDescription"),
);
const SchematicDropInfo = React.lazy(
  () => import("@components/Wiki/SchematicDropInfo"),
);
const DropsInfo = React.lazy(() => import("@components/Wiki/DropsInfo"));
const CanBeUsedInfo = React.lazy(
  () => import("@components/Wiki/CanBeUsedInfo"),
);
const SchematicItems = React.lazy(
  () => import("@components/Wiki/SchematicItems"),
);

const ItemWiki = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const params = useParams();
  const name = params?.name as string;
  const [item, setItem] = useState<Item>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [rarity, setRarity] = useState<string>("Common");
  const [textColor, setTextColor] = useState<string>("text-gray-400");

  useEffect(() => {
    const loadData = async () => {
      let itemName = name;
      if (name) {
        itemName = getItemDecodedName(name);
      }

      const items = await getItems();
      if (items) {
        const foundItem = items.find(
          (it) => it.name.toLowerCase() === itemName,
        );

        if (!foundItem) {
          router.push("/404");
          return;
        }

        setItem(foundItem);
        setAllItems(items);
        setIsLoaded(true);
      }
    };

    loadData();
  }, [name, router]);

  const showIngredient = useCallback((ingre: Item) => {
    if (!ingre?.crafting) {
      return;
    }

    return ingre?.crafting?.map((recipe, index) => (
      <div
        className={
          ingre?.crafting && ingre?.crafting?.length > 1
            ? "w-full border-l-4 border-green-500 p-4 bg-gray-900 rounded-lg lg:w-1/2 flex gap-2 flex-col"
            : "w-full"
        }
        key={`ingredients-${index}-${ingre.name}`}
      >
        <Ingredients crafting={recipe} value={1} />
        {recipe.station && <Station name={recipe.station} />}
        {recipe.time && <CraftingTime time={recipe.time} />}
      </div>
    ));
  }, []);

  const showDescription = useMemo(
    () =>
      item?.description && (
        <div className="w-full md:w-1/2 px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
            <div className="p-4 bg-gray-900 border-b border-gray-700 text-neutral-300">
              {t("common.description")}
            </div>
            <div className="p-4 text-neutral-400">{item.description}</div>
          </div>
        </div>
      ),
    [item?.description, t],
  );

  const updateRarity = useCallback((value: Rarity) => {
    setRarity(value);

    switch (value) {
      case Rarity.Common:
        setTextColor("text-gray-400");
        break;
      case Rarity.Uncommon:
        setTextColor("text-green-400");
        break;
      case Rarity.Rare:
        setTextColor("text-blue-400");
        break;
      case Rarity.Epic:
        setTextColor("text-red-400");
        break;
      case Rarity.Legendary:
        setTextColor("text-yellow-400");
        break;
      default:
        setTextColor("text-gray-400");
    }
  }, []);

  const getRarityClass = useCallback(
    (value: Rarity) => {
      let outlineColor = "";
      let hoverColor = "";
      let focusColor = "";
      let textColor = "";

      switch (value) {
        case Rarity.Legendary:
          outlineColor = "border-yellow-500";
          hoverColor = "hover:bg-yellow-500";
          textColor = "text-yellow-500";
          focusColor = "focus:ring-yellow-500";
          break;
        case Rarity.Epic:
          outlineColor = "border-red-500";
          hoverColor = "hover:bg-red-500";
          textColor = "text-red-500";
          focusColor = "focus:ring-red-500";
          break;
        case Rarity.Rare:
          outlineColor = "border-blue-500";
          hoverColor = "hover:bg-blue-500";
          textColor = "text-blue-500";
          focusColor = "focus:ring-blue-500";
          break;
        case Rarity.Uncommon:
          outlineColor = "border-green-500";
          hoverColor = "hover:bg-green-500";
          textColor = "text-green-500";
          focusColor = "focus:ring-green-500";
          break;
        default:
          outlineColor = "border-gray-500";
          hoverColor = "hover:bg-gray-500";
          textColor = "text-gray-500";
          focusColor = "focus:ring-gray-500";
      }

      return `px-4 py-2 border rounded-lg hover:text-gray-300 ${textColor} ${outlineColor} ${hoverColor} focus:outline-none focus:ring-2 ${focusColor} ${
        rarity === value ? "bg-opacity-20" : ""
      }`;
    },
    [rarity],
  );

  const loadingItemPart = () => (
    <div className="w-full md:w-1/2">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
        <LoadingScreen />
      </div>
    </div>
  );

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  const itemName = item?.name ?? name;
  const parentUrl = item?.parent && getItemUrl(item.parent);
  const craftUrl = getItemCraftUrl(name ?? itemName);

  return (
    <div
      className="container mx-auto px-4"
      data-cy="wiki-item"
      data-name={itemName}
    >
      {/* Metadata is now handled by generateMetadata */}
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
                    <div className="text-gray-300">
                      {t("crafting.costToLearn")}
                    </div>
                    <div className="text-gray-400">
                      {`${item?.cost?.count ? item.cost.count : ""} ${
                        item?.cost?.name ? t(item?.cost?.name) : ""
                      }`}
                    </div>
                  </li>
                )}
                {item?.category && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("common.category")}</div>
                    <div className="text-gray-400">
                      {t(item.category, { ns: "items" })}
                    </div>
                  </li>
                )}
                {item?.parent && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("common.parent")}</div>
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
              <div className="mb-2 text-gray-300">
                {t("common.selectRarity")}
              </div>
              <fieldset
                className="inline-flex rounded-lg shadow-sm"
                aria-label={t("common.raritySelection")}
              >
                <legend className="sr-only">
                  {t("common.raritySelection")}
                </legend>
                {[
                  Rarity.Common,
                  Rarity.Uncommon,
                  Rarity.Rare,
                  Rarity.Epic,
                  Rarity.Legendary,
                ].map((rar: Rarity) => (
                  <button
                    key={rar}
                    type="button"
                    aria-pressed={rarity === rar}
                    className={`${getRarityClass(rar)} flex items-center justify-center px-3 py-2 w-[100px] h-[40px] font-medium text-sm focus:z-10 ${rarity === rar ? "ring-2 ring-opacity-50" : ""}`}
                    onClick={() => updateRarity(rar)}
                  >
                    <span className="w-4 mr-1">
                      {rar === rarity ? "✓" : ""}
                    </span>
                    {t(rar)}
                  </button>
                ))}
              </fieldset>
            </div>
          </div>
        </div>
        {item?.crafting && (
          <div className="w-full lg:w-1/2 px-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
              <div className="p-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
                <span className="text-neutral-300">{t("crafting.recipe")}</span>
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
          {item && <SchematicItems key="schematicItems" item={item} />}
        </Suspense>
        {showDescription}
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
            name={itemName}
            items={allItems}
          />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <WikiDescription key="wikidescription" name={itemName} />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <CanBeUsedInfo key="CanBeUsedInfo" name={itemName} items={allItems} />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <DropsInfo key="dropInfo" drops={item?.drops} />
        </Suspense>
        <Comments key="comments" name={itemName} />
      </div>
    </div>
  );
};

export default ItemWiki;
