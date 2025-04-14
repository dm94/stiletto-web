import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import { getItems } from "../functions/services";
import ModalMessage from "../components/ModalMessage";
import Items from "../components/Crafter/Items";
import SelectedItem from "../components/Crafter/SelectedItem";
import TotalMaterials from "../components/Crafter/TotalMaterials";
import { getDomain } from "../functions/utils";
import { getRecipe } from "../functions/requests/recipes";
import { useLocation } from "react-router";
import type { CraftItem, Item, ItemRecipe } from "../types/item";

const Crafter: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<CraftItem[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>("");
  const [isItemsNavVisible, setIsItemsNavVisible] = useState<boolean>(false);

  useEffect(() => {
    updateRecipes();
  }, []);

  const updateSearch = useCallback(
    (searchText: string): void => {
      const filtered = allItems.filter((item) => {
        return searchText.split(" ").every((searchTerm) => {
          return t(item.name).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
      setFilteredItems(filtered);
    },
    [allItems, t],
  );

  useEffect(() => {
    if (allItems.length > 0 && searchText.length > 0) {
      updateSearch(searchText);
    }
  }, [allItems, searchText, updateSearch]);

  const updateRecipes = async (): Promise<void> => {
    const itemsData = await getItems();
    if (itemsData) {
      const craftableItems = itemsData.filter((it) => it.crafting);
      setAllItems(craftableItems);

      await getRecipes(craftableItems);
    }
  };

  const getRecipes = async (items: Item[]): Promise<void> => {
    const parsed = queryString.parse(location?.search);
    const { recipe, craft } = parsed;

    if (recipe) {
      try {
        const response = await getRecipe(String(recipe));

        if (response.items) {
          for (const item of response.items) {
            handleAdd(item.name, item.count, items);
          }
        }
      } catch {
        setError("errors.apiConnection");
      }
    } else if (craft) {
      const decodedName = decodeURI(String(craft))
        .toLowerCase()
        .replaceAll("_", " ")
        .trim();
      setSearchText(decodedName);
    }
  };

  const handleInputChangeSearchItem = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event) {
        const newSearchText = event.currentTarget.value;
        setSearchText(newSearchText);
      }
    },
    [],
  );

  const removeSelectedItem = useCallback((itemName: string): void => {
    setSelectedItems((prevItems) =>
      prevItems.filter((it) => it.name !== itemName),
    );
  }, []);

  const changeCount = useCallback(
    (itemName: string, count: number): void => {
      if (count <= 0) {
        removeSelectedItem(itemName);
        return;
      }

      setSelectedItems((prevItems) =>
        prevItems.map((item) =>
          item.name === itemName ? { ...item, count } : item,
        ),
      );
    },
    [removeSelectedItem],
  );

  const getIngredients = useCallback(
    (itemName: string, secondTree: boolean): any => {
      const selectedItem = allItems.find((it) => it.name === itemName);
      if (!selectedItem?.crafting) {
        return [];
      }

      return selectedItem.crafting.map(
        (recipe): ItemRecipe => ({
          ...recipe,
          ingredients: recipe.ingredients?.map((ingredient) => ({
            ...ingredient,
            ingredients: secondTree
              ? []
              : getIngredients(ingredient.name, true),
          })),
        }),
      );
    },
    [allItems],
  );

  const handleAdd = useCallback(
    (itemName: string, count = 1, itemsList = allItems): void => {
      const existingItem = selectedItems.find((it) => it.name === itemName);

      if (existingItem) {
        changeCount(
          itemName,
          Number.parseInt(existingItem.count.toString()) + count,
        );
        return;
      }

      const selectedItem = itemsList.find((it) => it.name === itemName);
      if (selectedItem) {
        setSelectedItems((prevItems) => [
          ...prevItems,
          {
            ...selectedItem,
            name: selectedItem.name,
            category: selectedItem.category ?? "",
            crafting: getIngredients(selectedItem.name, false),
            count,
          },
        ]);
      }
    },
    [allItems, selectedItems, changeCount, getIngredients],
  );

  const showAllItems = useMemo((): React.ReactNode => {
    if (filteredItems.length > 0 || searchText.length > 0) {
      return (
        <Items key="itemListFiltered" items={filteredItems} onAdd={handleAdd} />
      );
    }
    return <Items key="itemList" items={allItems} onAdd={handleAdd} />;
  }, [filteredItems, searchText, allItems, handleAdd]);

  const showSelectedItems = useMemo((): React.ReactNode => {
    return selectedItems.map((item) => (
      <SelectedItem key={item.name} item={item} onChangeCount={changeCount} />
    ));
  }, [selectedItems, changeCount]);

  const toggleItemsNav = useCallback((): void => {
    setIsItemsNavVisible((prev) => !prev);
  }, []);

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
    <div className="flex flex-col lg:flex-row">
      <Helmet>
        <title>Last Oasis Crafting Calculator - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="See the materials needed to build each thing"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Crafter - Stiletto for Last Oasis"
        />
        <meta
          name="twitter:description"
          content="See the materials needed to build each thing"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/crafter`} />
      </Helmet>
      <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
        <form className="flex items-center">
          <input
            className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="search"
            placeholder={t("common.search")}
            aria-label={t("common.search")}
            data-cy="crafter-search"
            onChange={handleInputChangeSearchItem}
            value={searchText}
          />
          <button
            className="lg:hidden ml-3 p-2 text-gray-300 hover:text-white focus:outline-none"
            type="button"
            onClick={toggleItemsNav}
            aria-controls="items-nav"
            aria-expanded={isItemsNavVisible}
            aria-label="Toggle items"
          >
            <i className="fas fa-list fa-lg" />
          </button>
        </form>
        <nav
          className={`mt-2 lg:block ${isItemsNavVisible ? "block" : "hidden"}`}
          id="items-nav"
          aria-label="Items Navs"
        >
          <div className="overflow-auto h-[95vh]">{showAllItems}</div>
        </nav>
      </div>
      <main className="w-full lg:w-3/4 p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showSelectedItems}
        </div>
        <div className="mt-4">
          <TotalMaterials
            key="totalmaterialsid"
            selectedItems={selectedItems}
          />
        </div>
      </main>
    </div>
  );
};

export default Crafter;
