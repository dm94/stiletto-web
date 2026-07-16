import { useWebMCP, useWebMCPContext } from "@mcp-b/react-webmcp";
import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import { z } from "zod";
import { getItems } from "@functions/github";
import ModalMessage from "@components/ModalMessage";
import Items from "@components/Crafter/Items";
import SelectedItem from "@components/Crafter/SelectedItem";
import TotalMaterials from "@components/Crafter/TotalMaterials";
import { getDomain, getItemDecodedName } from "@functions/utils";
import { getRecipe } from "@functions/requests/recipes";
import { useLocation } from "react-router";
import type { CraftItem, Item, ItemRecipe } from "@ctypes/item";
import HeaderMeta from "@components/HeaderMeta";
import { FaList, FaExclamationTriangle } from "react-icons/fa";
import ReportIncidentModal from "@components/ReportIncidentModal";

const getIngredientsFromItems = (
  itemsMap: Map<string, Item>,
  itemName: string,
  secondTree: boolean,
): ItemRecipe[] => {
  const selectedItem = itemsMap.get(itemName);
  if (!selectedItem?.crafting) {
    return [];
  }

  return selectedItem.crafting.map(
    (itemRecipe): ItemRecipe => ({
      ...itemRecipe,
      ingredients: itemRecipe.ingredients?.map((ingredient) => ({
        ...ingredient,
        ingredients: secondTree
          ? []
          : getIngredientsFromItems(itemsMap, ingredient.name, true),
      })),
    }),
  );
};

const mapRecipeItemsToSelectedItems = (
  items: Item[],
  recipes: Array<{ name: string; count: number }>,
): CraftItem[] => {
  const nextSelectedItems: CraftItem[] = [];
  const itemsMap = new Map<string, Item>();
  for (const item of items) {
    itemsMap.set(item.name, item);
  }

  for (const recipeItem of recipes) {
    const selectedItem = itemsMap.get(recipeItem.name);
    if (!selectedItem) {
      continue;
    }

    nextSelectedItems.push({
      ...selectedItem,
      name: selectedItem.name,
      category: selectedItem.category ?? "",
      crafting: getIngredientsFromItems(itemsMap, selectedItem.name, false),
      count: recipeItem.count,
    });
  }

  return nextSelectedItems;
};

const Crafter: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<CraftItem[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>("");
  const [isItemsNavVisible, setIsItemsNavVisible] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const loadRecipeSelection = useCallback(
    async (recipeToken: string, craftableItems: Item[]): Promise<void> => {
      try {
        const response = await getRecipe(recipeToken);
        const recipes = response.items ?? [];
        const nextSelectedItems = mapRecipeItemsToSelectedItems(
          craftableItems,
          recipes,
        );
        setSelectedItems(nextSelectedItems);
      } catch {
        setError("errors.apiConnection");
      }
    },
    [],
  );

  useEffect(() => {
    const updateRecipes = async (): Promise<void> => {
      try {
        const itemsData = await getItems();
        if (!itemsData) {
          return;
        }

        const craftableItems = itemsData.filter((it) => it.crafting);
        setAllItems(craftableItems);

        const parsed = queryString.parse(location.search);
        const recipeToken =
          typeof parsed.recipe === "string" ? parsed.recipe : undefined;
        const craftToken =
          typeof parsed.craft === "string" ? parsed.craft : undefined;

        if (recipeToken) {
          await loadRecipeSelection(recipeToken, craftableItems);
          return;
        }

        if (craftToken) {
          const decodedName = getItemDecodedName(craftToken);
          setSearchText(decodedName);
        }
      } catch {
        setError("errors.apiConnection");
      }
    };

    updateRecipes();
  }, [location.search, loadRecipeSelection]);

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

  const handleInputChangeSearchItem = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event) {
        const newSearchText = event.currentTarget.value;
        setSearchText(newSearchText);
      }
    },
    [],
  );

  // Pre-index items to enable O(1) map lookup during ingredient resolution and node selection
  const allItemsMap = useMemo(() => {
    const map = new Map<string, Item>();
    for (const item of allItems) {
      map.set(item.name, item);
    }
    return map;
  }, [allItems]);

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
    (itemName: string, secondTree: boolean): ItemRecipe[] =>
      getIngredientsFromItems(allItemsMap, itemName, secondTree),
    [allItemsMap],
  );

  const handleAdd = useCallback(
    (itemName: string, count = 1, itemsList = allItems): void => {
      const existingItem = selectedItems.find((it) => it.name === itemName);

      if (existingItem) {
        changeCount(itemName, existingItem.count + count);
        return;
      }

      const selectedItem =
        itemsList === allItems
          ? allItemsMap.get(itemName)
          : itemsList.find((it) => it.name === itemName);
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
    [allItems, allItemsMap, selectedItems, changeCount, getIngredients],
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

  const toggleReportModal = useCallback((): void => {
    setIsReportModalOpen((prev) => !prev);
  }, []);

  useWebMCPContext(
    "crafter_context",
    "Current crafter state: selected items with their counts",
    () => ({
      selectedItems: selectedItems.map((item) => ({
        name: item.name,
        displayName: t(item.name, { ns: "items" }),
        count: item.count,
      })),
    }),
  );

  useWebMCP({
    name: "crafter_search",
    description:
      "Search for craftable items by name. Returns matching item names and display names. Use the 'name' field from results with crafter_add_item.",
    inputSchema: {
      query: z.string().describe("Search query to find items by name"),
    },
    outputSchema: {
      items: z.array(z.object({ name: z.string(), displayName: z.string() })),
      total: z.number(),
    },
    annotations: {
      title: "Search Craftable Items",
      readOnlyHint: true,
    },
    handler: async ({ query }) => {
      const lowerQuery = query.toLowerCase();
      const filtered = allItems.filter((item) =>
        t(item.name, { ns: "items" }).toLowerCase().includes(lowerQuery),
      );
      return {
        items: filtered.slice(0, 20).map((item) => ({
          name: item.name,
          displayName: t(item.name, { ns: "items" }),
        })),
        total: filtered.length,
      };
    },
    formatOutput: (result) =>
      `Found ${result.total} items: ${result.items.map((i) => i.displayName).join(", ")}`,
  });

  useWebMCP({
    name: "crafter_add_item",
    description:
      "Add a craftable item to the crafting list. Use crafter_search first to find the exact item name.",
    inputSchema: {
      name: z
        .string()
        .describe("Item name (the 'name' field from crafter_search results)"),
      count: z.number().min(1).default(1).describe("Quantity to add"),
    },
    outputSchema: {
      success: z.boolean(),
      name: z.string(),
      count: z.number(),
    },
    annotations: {
      title: "Add Item to Crafter",
      readOnlyHint: false,
      idempotentHint: false,
    },
    handler: async ({ name, count }) => {
      const exists = allItems.some((it) => it.name === name);
      if (!exists) {
        throw new Error(
          `Item "${name}" not found. Use crafter_search to find available items.`,
        );
      }
      handleAdd(name, count);
      return { success: true, name, count };
    },
    formatOutput: (result) => `Added ${result.count}x ${result.name}`,
  });

  useWebMCP({
    name: "crafter_remove_item",
    description: "Remove an item from the crafting list by name.",
    inputSchema: {
      name: z.string().describe("The item name to remove"),
    },
    outputSchema: {
      success: z.boolean(),
      name: z.string(),
    },
    annotations: {
      title: "Remove Item from Crafter",
      readOnlyHint: false,
      idempotentHint: true,
    },
    handler: async ({ name }) => {
      removeSelectedItem(name);
      return { success: true, name };
    },
    formatOutput: (result) => `Removed ${result.name} from the crafting list`,
  });

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
      <HeaderMeta
        title={t("seo.crafter.title")}
        description={t("crafting.description")}
        canonical={`${getDomain()}/crafter`}
        keywords="Last Oasis crafting, crafting calculator, resource requirements, item crafting, material calculator, Last Oasis items, crafting materials, game crafting system, resource planning, crafting recipes, Last Oasis resources"
      />
      <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
        <form className="flex items-center">
          <input
            className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="search"
            placeholder={t("common.search")}
            aria-label={t("common.search")}
            data-testid="crafter-search"
            onChange={handleInputChangeSearchItem}
            value={searchText}
          />
          <button
            className="ml-3 p-2 text-gray-300 hover:text-white focus:outline-none bg-transparent"
            type="button"
            onClick={toggleReportModal}
            aria-label={t("crafter.reportBug")}
            title={t("crafter.reportBug")}
          >
            <FaExclamationTriangle className="fa-lg" />
          </button>
          <button
            className="lg:hidden ml-3 p-2 text-gray-300 hover:text-white focus:outline-none"
            type="button"
            onClick={toggleItemsNav}
            aria-controls="items-nav"
            aria-expanded={isItemsNavVisible}
            aria-label="Toggle items"
          >
            <FaList className="fa-lg" />
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
      {isReportModalOpen && (
        <ReportIncidentModal
          isOpen={isReportModalOpen}
          onClose={toggleReportModal}
        />
      )}
    </div>
  );
};

export default Crafter;
