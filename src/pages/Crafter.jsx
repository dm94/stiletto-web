import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import { getItems } from "../services";
import ModalMessage from "../components/ModalMessage";
import Items from "../components/Crafter/Items";
import SelectedItem from "../components/Crafter/SelectedItem";
import TotalMaterials from "../components/Crafter/TotalMaterials";
import { getDomain } from "../functions/utils";
import { getRecipe } from "../functions/requests/recipes";

const Crafter = ({ location }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    updateRecipes();
  }, []);

  const updateRecipes = async () => {
    const itemsData = await getItems();
    if (itemsData) {
      const craftableItems = itemsData.filter((it) => it.crafting);
      setItems(craftableItems);
      getRecipes();
    }
  };

  const getRecipes = async () => {
    const parsed = queryString.parse(location?.search);
    const { recipe, craft } = parsed;

    if (recipe?.length) {
      try {
        const response = getRecipe(recipe);

        if (response.status === 200) {
          const data = await response.json();
          if (data.items) {
            for (const item of data.items) {
              handleAdd(item.name, Number.parseInt(item.count));
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
    const filtered = items.filter((item) => {
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
    return <Items key="itemList" items={items} onAdd={handleAdd} />;
  };

  const handleAdd = (itemName, count = 1) => {
    const selectedItem = items.find((it) => it.name === itemName);
    const existingItem = selectedItems.find((it) => it.name === itemName);

    if (existingItem) {
      changeCount(itemName, Number.parseInt(existingItem.count) + count);
    } else if (selectedItem) {
      setSelectedItems([
        ...selectedItems,
        {
          name: selectedItem.name,
          category: selectedItem.category || "",
          crafting: getIngredients(selectedItem.name),
          damage: selectedItem.damage,
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

    setSelectedItems(
      selectedItems.map((item) =>
        item.name === itemName ? { ...item, count } : item
      )
    );
  };

  const getIngredients = (itemName, secondTree = false) => {
    const selectedItem = items.find((it) => it.name === itemName);
    if (!selectedItem?.crafting) {
      return [];
    }

    return selectedItem.crafting.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients?.map((ingredient) => ({
        ...ingredient,
        ingredients: !secondTree ? getIngredients(ingredient.name, true) : [],
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
    setSelectedItems(selectedItems.filter((it) => it.name !== itemName));
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
      <div className="col mb-2">
        <form className="bd-search d-flex align-items-center">
          <input
            className="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
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
        <div className="col-12 card-group">{showSelectedItems()}</div>
        <div className="col-12">
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
