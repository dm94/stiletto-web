import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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


const Crafter = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState("");
  const [isItemsNavVisible, setIsItemsNavVisible] = useState(false);

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

  const getRecipes = async (items) => {
    const parsed = queryString.parse(location?.search);
    const { recipe, craft } = parsed;

    if (recipe?.length) {
      try {
        const response = await getRecipe(recipe);

        if (response.status === 200) {
          const data = await response.json();
          if (data.items) {
            for (const item of data.items) {
              handleAdd(item.name, Number.parseInt(item.count), items);
            }
          }
        } else if (response.status === 503) {
          setError("Error connecting to database");
        }
      } catch {
        setError("Error when connecting to the API");
      }
    } else if (craft?.length) {
      const decodedName = decodeURI(craft).toLowerCase();
      setSearchText(decodedName);
      updateSearch(decodedName);
    }
  };

  const handleInputChangeSearchItem = (event) => {
    if (event) {
      const newSearchText = event.currentTarget.value;
      setSearchText(newSearchText);
      updateSearch(newSearchText);
    }
  };

  const updateSearch = (searchText) => {
    const filtered = allItems.filter((item) => {
      return searchText.split(" ").every((searchTerm) => {
        return t(item.name).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
    setFilteredItems(filtered);
  };

  const showAllItems = () => {
    if (filteredItems.length > 0 || searchText.length > 0) {
      return (
        <Items key="itemListFiltered" items={filteredItems} onAdd={handleAdd} />
      );
    }
    return <Items key="itemList" items={allItems} onAdd={handleAdd} />;
  };

  const handleAdd = (itemName, count = 1, itemsList = allItems) => {
    const existingItem = selectedItems.find((it) => it.name === itemName);

    if (existingItem) {
      changeCount(itemName, Number.parseInt(existingItem.count) + count);
      return;
    }

    const selectedItem = itemsList.find((it) => it.name === itemName);
    if (selectedItem) {
      setSelectedItems([
        ...selectedItems,
        {
          ...selectedItem,
          name: selectedItem.name,
          category: selectedItem.category || "",
          crafting: getIngredients(selectedItem.name),
          count,
        },
      ]);
    }
  };

  const changeCount = (itemName, count) => {
    if (count <= 0) {
      removeSelectedItem(itemName);
      return;
    }

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName ? { ...item, count } : item,
      ),
    );
  };

  const getIngredients = (itemName, secondTree = false) => {
    const selectedItem = allItems.find((it) => it.name === itemName);
    if (!selectedItem?.crafting) {
      return [];
    }

    return selectedItem.crafting.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients?.map((ingredient) => ({
        ...ingredient,
        ingredients: secondTree ? [] : getIngredients(ingredient.name, true),
      })),
    }));
  };

  const showSelectedItems = () => {
    return selectedItems.map((item) => (
      <SelectedItem
        key={item.name}
        item={item}
        value={item.count}
        onChangeCount={changeCount}
      />
    ));
  };

  const removeSelectedItem = (itemName) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((it) => it.name !== itemName),
    );
  };

  const toggleItemsNav = () => {
    setIsItemsNavVisible(!isItemsNavVisible);
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
            placeholder="Search"
            aria-label="Search"
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
          <div className="overflow-auto h-[95vh]">{showAllItems()}</div>
        </nav>
      </div>
      <main className="w-full lg:w-3/4 p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showSelectedItems()}
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
