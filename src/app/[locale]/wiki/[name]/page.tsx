"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Item } from "@/types/items";
import { getItems } from "@/lib/services";
import { ItemInfo } from "@/components/Wiki/ItemInfo";
import { CraftingInfo } from "@/components/Wiki/CraftingInfo";
import { DropsInfo } from "@/components/Wiki/DropsInfo";
import { CanBeUsedInfo } from "@/components/Wiki/CanBeUsedInfo";
import { Comments } from "@/components/Wiki/Comments";

export default function WikiItem() {
  const t = useTranslations();
  const params = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = await getItems();
      if (fetchedItems) {
        setItems(fetchedItems);
        const foundItem = fetchedItems.find(
          (it) =>
            it.name.toLowerCase() ===
            decodeURIComponent(params.name as string).toLowerCase()
        );
        setItem(foundItem || null);
      }
    };

    fetchData();
  }, [params.name]);

  if (!item) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header text-center">{t("Item not found")}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <h1 className="text-center mb-4">{t(item.name)}</h1>
        {item.description && (
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Description")}</div>
            <div className="card-body">
              <p className="card-text">{t(item.description)}</p>
            </div>
          </div>
        )}
      </div>
      <ItemInfo item={item} />
      <CraftingInfo item={item} />
      <DropsInfo drops={item.drops} />
      <CanBeUsedInfo name={item.name} items={items} />
      <div className="col-12">
        <Comments name={item.name} />
      </div>
    </div>
  );
}
