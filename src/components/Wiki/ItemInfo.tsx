"use client";

import { useTranslations } from "next-intl";
import { Item } from "@/types/items";

interface ItemInfoProps {
  item: Item;
}

export const ItemInfo = ({ item }: ItemInfoProps) => {
  const t = useTranslations();

  if (!item) {
    return null;
  }

  return (
    <div className="col-12 col-md-6">
      <div className="card border-secondary mb-3">
        <div className="card-header">{t("Item Information")}</div>
        <div className="card-body">
          {item.category && (
            <div className="mb-2">
              <strong>{t("Category")}:</strong> {item.category}
            </div>
          )}
          {item.type && (
            <div className="mb-2">
              <strong>{t("Type")}:</strong> {item.type}
            </div>
          )}
          {item.quality !== undefined && (
            <div className="mb-2">
              <strong>{t("Quality")}:</strong> {item.quality}
            </div>
          )}
          {item.weight !== undefined && (
            <div className="mb-2">
              <strong>{t("Weight")}:</strong> {item.weight}
            </div>
          )}
          {item.durability !== undefined && (
            <div className="mb-2">
              <strong>{t("Durability")}:</strong> {item.durability}
            </div>
          )}
          {item.damage !== undefined && (
            <div className="mb-2">
              <strong>{t("Damage")}:</strong> {item.damage}
            </div>
          )}
          {item.protection !== undefined && (
            <div className="mb-2">
              <strong>{t("Protection")}:</strong> {item.protection}
            </div>
          )}
          {item.waterProtection !== undefined && (
            <div className="mb-2">
              <strong>{t("Water Protection")}:</strong> {item.waterProtection}
            </div>
          )}
          {item.stackSize !== undefined && (
            <div className="mb-2">
              <strong>{t("Stack Size")}:</strong> {item.stackSize}
            </div>
          )}
          {item.experiencieReward !== undefined && (
            <div className="mb-2">
              <strong>{t("Experience Reward")}:</strong>{" "}
              {item.experiencieReward}
            </div>
          )}
          {item.trade_price !== undefined && (
            <div className="mb-2">
              <strong>{t("Trade Price")}:</strong> {item.trade_price}
            </div>
          )}
          {item.cost && (
            <div className="mb-2">
              <strong>{t("Cost")}:</strong> {item.cost.count} {item.cost.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemInfo;
