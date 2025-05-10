import React, {
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { getItems, getItemInfo } from "@functions/github";
import { Navigate, useParams, useNavigate } from "react-router";
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
import HeaderMeta from "@components/HeaderMeta";
import { type Item, type ItemCompleteInfo, Rarity } from "@ctypes/item";

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
const CreatureDropsInfo = React.lazy(
  () => import("@components/Wiki/CreatureDropsInfo"),
);

const ItemWiki = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { name, rarity: rarityParam } = useParams();
  const [item, setItem] = useState<Item>();
  const [itemInfo, setItemInfo] = useState<ItemCompleteInfo>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [textColor, setTextColor] = useState<string>("text-gray-400");

  const rarity = Object.values(Rarity).includes(rarityParam as Rarity)
    ? (rarityParam as Rarity)
    : Rarity.Common;

  useEffect(() => {
    const loadData = async () => {
      let itemName = name;
      if (itemName) {
        itemName = getItemDecodedName(itemName);
      }

      const items = await getItems();
      if (items) {
        const foundItem = items.find(
          (it) => it.name.toLowerCase() === itemName,
        );
        setItem(foundItem);
        setAllItems(items);

        try {
          const itemInfo = await getItemInfo(foundItem?.name ?? itemName ?? "");
          setItemInfo({
            ...itemInfo,
            ...foundItem,
          });
        } catch {
          setItemInfo(undefined);
        }
        setIsLoaded(true);
      }
    };

    loadData();
  }, [name]);

  const showIngredient = useCallback((ingre: Item) => {
    if (!ingre?.crafting) {
      return;
    }

    return ingre?.crafting?.map((recipe, index) => (
      <div
        className={
          ingre?.crafting && ingre?.crafting?.length > 1
            ? "w-full border-l-4 border-green-500 p-4 bg-gray-900 rounded-lg lg:w-1/2 flex gap-2 flex-col"
            : "w-full flex flex-col gap-2"
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
      itemInfo?.description && (
        <div className="w-full md:w-1/2 px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-4">
            <div className="p-4 bg-gray-900 border-b border-gray-700 text-neutral-300">
              {t("common.description")}
            </div>
            <div className="p-4 text-neutral-400">{itemInfo.description}</div>
          </div>
        </div>
      ),
    [itemInfo?.description, t],
  );

  useEffect(() => {
    switch (rarity) {
      case Rarity.Common:
        setTextColor("text-gray-400");
        break;
      case Rarity.Uncommon:
        setTextColor("text-green-400");
        break;
      case Rarity.Rare:
        setTextColor("text-blue-500");
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
  }, [rarity]);

  const updateRarity = useCallback(
    (value: Rarity) => {
      if (name) {
        navigate(getItemUrl(name, value));
      }
    },
    [name, navigate],
  );

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

  if (!item) {
    return <Navigate to={"/not-found"} />;
  }

  const itemName = item?.name ?? itemInfo?.name;
  const category = itemInfo?.category ?? item?.category;
  const parentUrl = itemInfo?.parent && getItemUrl(itemInfo.parent);
  const craftUrl = getItemCraftUrl(name ?? itemName);

  return (
    <div
      className="container mx-auto px-4"
      data-cy="wiki-item"
      data-name={itemName}
    >
      <HeaderMeta
        title={`${itemName} - Stiletto for Last Oasis`}
        description={`All information for ${itemName}`}
        canonical={getItemUrl(itemName, rarity)}
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
                {itemInfo?.cost && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">
                      {t("crafting.costToLearn")}
                    </div>
                    <div className="text-gray-400">
                      {`${itemInfo?.cost?.count ?? ""} ${
                        itemInfo?.cost?.name ? t(itemInfo?.cost?.name) : ""
                      }`}
                    </div>
                  </li>
                )}
                {category && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("common.category")}</div>
                    <div className="text-gray-400">
                      {t(category, { ns: "items" })}
                    </div>
                  </li>
                )}
                {itemInfo?.parent && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("common.parent")}</div>
                    <div className="text-gray-400">
                      <a href={parentUrl} className="hover:text-blue-400">
                        {t(itemInfo.parent, { ns: "items" })}
                      </a>
                    </div>
                  </li>
                )}
                {itemInfo?.trade_price && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("wiki.tradePrice")}</div>
                    <div className="text-gray-400">
                      {itemInfo.trade_price} flots
                    </div>
                  </li>
                )}
                {itemInfo?.stackSize && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">
                      {t("wiki.characterStack")}
                    </div>
                    <div className="text-gray-400">{itemInfo.stackSize}</div>
                  </li>
                )}
                {itemInfo?.weight && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("wiki.weight")}</div>
                    <div className={textColor}>
                      {calcRarityValue(
                        rarity,
                        "weight",
                        itemInfo.category,
                        itemInfo.weight,
                      )}
                    </div>
                  </li>
                )}
                {itemInfo?.experiencieReward && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">
                      {t("wiki.experiencieReward")}
                    </div>
                    <div className={textColor}>
                      {calcRarityValue(
                        rarity,
                        "experiencieReward",
                        itemInfo.category,
                        itemInfo.experiencieReward,
                      )}
                    </div>
                  </li>
                )}
                {itemInfo?.durability && (
                  <li className="flex justify-between items-center p-3 border-b border-gray-700 last:border-b-0">
                    <div className="text-gray-300">{t("wiki.durability")}</div>
                    <div className={textColor}>
                      {calcRarityValue(
                        rarity,
                        "durability",
                        itemInfo.category,
                        itemInfo.durability,
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
                    className={`${getRarityClass(
                      rar,
                    )} flex capitalize items-center justify-center px-3 py-2 w-[100px] h-[40px] font-medium text-sm focus:z-10 ${
                      rarity === rar ? "ring-2 ring-opacity-50" : ""
                    }`}
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
        {item.crafting && (
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
              <div className="p-4 flex flex-wrap">{showIngredient(item)}</div>
            </div>
          </div>
        )}
        <Suspense fallback={loadingItemPart()}>
          <SchematicItems key="schematicItems" item={item} />
        </Suspense>
        {showDescription}
        {itemInfo?.structureInfo && (
          <GenericInfo
            key="structureInfo"
            name="wiki.structureInfo"
            dataInfo={itemInfo.structureInfo}
            rarity={rarity}
            textColor={textColor}
            category={itemInfo.category}
          />
        )}
        {itemInfo?.projectileDamage && (
          <GenericInfo
            key="proyectileInfo"
            name="wiki.ProjectileInfo"
            dataInfo={itemInfo.projectileDamage}
            rarity={rarity}
            textColor={textColor}
            category={itemInfo.category}
          />
        )}
        {itemInfo?.weaponInfo && (
          <GenericInfo
            key="weaponinfo"
            name="wiki.WeaponInfo"
            dataInfo={itemInfo.weaponInfo}
            rarity={rarity}
            textColor={textColor}
            category={itemInfo.category}
          />
        )}
        {itemInfo?.armorInfo && (
          <GenericInfo
            key="armorinfo"
            name="wiki.ArmorInfo"
            dataInfo={itemInfo.armorInfo}
            rarity={rarity}
            textColor={textColor}
            category={itemInfo.category}
          />
        )}
        {itemInfo?.upgradeInfo && (
          <GenericInfo
            key="upgradeInfo"
            name="wiki.upgradeInfo"
            dataInfo={itemInfo.upgradeInfo}
            rarity={rarity}
            textColor={textColor}
            category={itemInfo.category}
          />
        )}
        {itemInfo?.toolInfo && (
          <ToolInfo
            key="toolinfo"
            toolInfo={itemInfo.toolInfo}
            rarity={rarity}
            textColor={textColor}
          />
        )}
        {itemInfo?.walkerInfo && (
          <GenericInfo
            key="walkerInfo"
            name="wiki.walkerInfo"
            dataInfo={itemInfo.walkerInfo}
            rarity={rarity}
            textColor={textColor}
            category={itemInfo.category}
          />
        )}
        {itemInfo?.moduleInfo && (
          <ModuleInfo key="moduleinfo" moduleInfo={itemInfo.moduleInfo} />
        )}
        <Suspense fallback={loadingItemPart()}>
          {itemInfo?.learn && (
            <SchematicDropInfo key="schematicInfo" item={itemInfo} />
          )}
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <WikiDescription key="wikidescription" name={itemName} />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <CanBeUsedInfo key="CanBeUsedInfo" name={itemName} items={allItems} />
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          {itemInfo?.droppedBy && (
            <DropsInfo key="dropInfo" drops={itemInfo?.droppedBy} />
          )}
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          {itemInfo?.drops && (
            <CreatureDropsInfo key="droppedInfo" drops={itemInfo?.drops} />
          )}
        </Suspense>
        <Suspense fallback={loadingItemPart()}>
          <Comments key="comments" name={itemName} />
        </Suspense>
      </div>
    </div>
  );
};

export default ItemWiki;
