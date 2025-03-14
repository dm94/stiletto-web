"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import type { Item } from "@/types/items";
import { getItems } from "@/lib/services";
import { getRecipe } from "@/lib/services/recipes";
import { Items } from "@/components/Crafter/Items";
import { SelectedItem } from "@/components/Crafter/SelectedItem";
import { TotalMaterials } from "@/components/Crafter/TotalMaterials";
import ModalMessage from "@/components/ModalMessage";

interface ExtendedItem extends Item {
  count?: number;
}

export default function CrafterPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<ExtendedItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    updateRecipes();
  }, []);

  const updateRecipes = async () => {
    const itemsData = await getItems();
    if (itemsData) {
      const craftableItems = itemsData.filter((it) => it.crafting);
      setAllItems(craftableItems);

      await getRecipes(craftableItems);
    }
  };

  const getRecipes = async (items: Item[]) => {
    const recipe = searchParams.get("recipe");
    const craft = searchParams.get("craft");

    if (recipe) {
      try {
        const data = await getRecipe(recipe);
        if (data?.items) {
          for (const item of data.items) {
            handleAdd(item.name, Number(item.count), items);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error when connecting to the API"
        );
      }
    } else if (craft) {
      const decodedName = decodeURIComponent(craft).toLowerCase();
      setSearchText(decodedName);
      updateSearch(decodedName);
    }
  };

  const handleInputChangeSearchItem = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSearchText = event.currentTarget.value;
    setSearchText(newSearchText);
    updateSearch(newSearchText);
  };

  const updateSearch = (text: string) => {
    const filtered = allItems.filter((item) => {
      return text
        .split(" ")
        .every((term) =>
          t(item.name).toLowerCase().includes(term.toLowerCase())
        );
    });
    setFilteredItems(filtered);
  };

  const showAllItems = () => {
    if (filteredItems.length > 0 || searchText.length > 0) {
      return <Items items={filteredItems} onAdd={handleAdd} />;
    }
    return <Items items={allItems} onAdd={handleAdd} />;
  };

  const handleAdd = (itemName: string, count = 1, itemsList = allItems) => {
    const existingItem = selectedItems.find((it) => it.name === itemName);

    if (existingItem) {
      changeCount(itemName, Number(existingItem.count) + count);
      return;
    }

    const selectedItem = itemsList.find((it) => it.name === itemName);
    if (selectedItem) {
      setSelectedItems([
        ...selectedItems,
        {
          ...selectedItem,
          count,
        },
      ]);
    }
  };

  const changeCount = (itemName: string, count: number) => {
    if (count <= 0) {
      removeSelectedItem(itemName);
      return;
    }

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName ? { ...item, count } : item
      )
    );
  };

  const removeSelectedItem = (itemName: string) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((it) => it.name !== itemName)
    );
  };

  if (error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/",
        }}
      />
    );
  }

  return (
    <div className="row flex-xl-nowrap">
      <div className="col mb-2">
        <form className="bd-search d-flex align-items-center">
          <input
            className="form-control"
            type="search"
            placeholder={t("Search")}
            aria-label={t("Search")}
            data-cy="crafter-search"
            onChange={handleInputChangeSearchItem}
            value={searchText}
          />
          <button
            className="btn btn-outline-primary d-md-none ml-3"
            type="button"
            data-toggle="collapse"
            data-target="#items-nav"
            aria-controls="items-nav"
            aria-expanded="false"
            aria-label="Toggle items"
          >
            <i className="fas fa-list fa-lg" />
          </button>
        </form>
        <nav
          className="collapse show mt-2"
          id="items-nav"
          aria-label="Items Navs"
        >
          <div
            className="nav overflow-auto list-group"
            style={{ height: "95vh" }}
          >
            {showAllItems()}
          </div>
        </nav>
      </div>
      <main className="col-md-9 col-lg-8 col-xl-8">
        <div className="col-12 card-group">
          {selectedItems.map((item) => (
            <SelectedItem
              key={item.name}
              item={item}
              value={item.count || 1}
              onChangeCount={changeCount}
            />
          ))}
        </div>
        <div className="col-12">
          <TotalMaterials selectedItems={selectedItems} />
        </div>
      </main>
    </div>
  );
}
