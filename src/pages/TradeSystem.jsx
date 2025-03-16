import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getItems, getStoredItem } from "../functions/services";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import Pagination from "../components/Pagination";
import Trade from "../components/TradeSystem/Trade";
import ClusterList from "../components/ClusterList";
import { getDomain } from "../functions/utils";
import {
  getTrades,
  deleteTrade,
  createTrade,
} from "../functions/requests/trades";

const TradeSystem = () => {
  const { t } = useTranslation();
  const [userDiscordId] = useState(getStoredItem("discordid"));
  const [isLoaded, setIsLoaded] = useState(false);
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [resourceTypeInput, setResourceTypeInput] = useState("Aloe Vera");
  const [tradeTypeInput, setTradeTypeInput] = useState("Supply");
  const [amountInput, setAmountInput] = useState(0);
  const [regionInput, setRegionInput] = useState("EU");
  const [qualityInput, setQualityInput] = useState(0);
  const [priceInput, setPriceInput] = useState(0);
  const [resourceTypeFilterInput, setResourceTypeFilterInput] = useState("");
  const [tradeTypeFilterInput, setTradeTypeFilterInput] = useState("");
  const [regionFilterInput, setRegionFilterInput] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    updateRecipes();
    updateTrades();
  }, []);

  const updateTrades = async (currentPage = page) => {
    setIsLoaded(false);
    setPage(currentPage);

    try {
      const response = await getTrades({
        pageSize: "10",
        page: currentPage.toString(),
        ...(tradeTypeFilterInput && { type: tradeTypeFilterInput }),
        ...(resourceTypeFilterInput && { resource: resourceTypeFilterInput }),
        ...(regionFilterInput && { region: regionFilterInput }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const hasMoreData = data != null && data.length >= 10;
        setTrades(data);
        setIsLoaded(true);
        setHasMore(hasMoreData);
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("errors.errorConnectingToAPI");
    }
  };

  const updateRecipes = async () => {
    const fetchedItems = await getItems();
    if (fetchedItems) {
      const filteredItems = fetchedItems.filter(
        (it) =>
          it.category === "Resources" ||
          it.category === "Ammo" ||
          it.category === "Armors" ||
          it.category === "Grappling Hooks" ||
          it.category === "Schematics" ||
          it.category === "Tools" ||
          it.category === "Liquids" ||
          it.name === "Sterile Bandage" ||
          it.name === "Primitive Bandage",
      );
      setItems(filteredItems);
    }
  };

  const handleDeleteTrade = async (idTrade) => {
    try {
      const response = await deleteTrade(idTrade);

      if (response.status === 204) {
        updateTrades();
      } else if (response.status === 401) {
        setError("Unauthorized");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("errors.errorConnectingToAPI");
    }
  };

  const handleCreateTrade = async (event) => {
    event.preventDefault();

    try {
      const response = await createTrade({
        resource: resourceTypeInput,
        type: tradeTypeInput,
        amount: amountInput.toString(),
        region: regionInput,
        quality: qualityInput.toString(),
        price: priceInput.toString(),
      });

      setResourceTypeInput("Aloe Vera");
      setTradeTypeInput("Supply");
      setAmountInput(0);
      setRegionInput("EU");
      setQualityInput(0);

      if (response.status === 201) {
        updateTrades();
      } else if (response.status === 400) {
        setError("Some data are missing");
      } else if (response.status === 401) {
        setError("These connection data are wrong");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("common.tryAgainLater");
    }
  };

  const renderLoggedPart = () => {
    if (!userDiscordId) {
      return (
        <div className="w-full lg:w-1/2 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 text-green-400">
              {t(
                "trades.publishTradeNotice",
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full p-4">
        <form onSubmit={handleCreateTrade} data-cy="create-trade-form">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
              {t("trades.publishTrade")}
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <label htmlFor="tradeType" className="block text-gray-300">
                    {t("common.type")}
                  </label>
                  <select
                    id="tradeType"
                    data-cy="trade-type"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tradeTypeInput}
                    onChange={(evt) => setTradeTypeInput(evt.target.value)}
                  >
                    <option value="Supply">{t("common.supply")}</option>
                    <option value="Demand">{t("trades.demand")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="resourcetype" className="block text-gray-300">
                    {t("trades.resourceOrMatsFor")}
                  </label>
                  <select
                    id="resourcetype"
                    data-cy="resource-type"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={resourceTypeInput}
                    onChange={(evt) => setResourceTypeInput(evt.target.value)}
                  >
                    {items?.map((item) => (
                      <option key={item.name} value={item.name}>
                        {t(item.name, { ns: "items" })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="regionInput" className="block text-gray-300">
                    {t("trades.region")}
                  </label>
                  <ClusterList
                    onError={setError}
                    value={regionInput}
                    onChange={setRegionInput}
                    filter={false}
                    id="regionInput"
                    data-cy="region-input"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="amountInput" className="block text-gray-300">
                    {t("trades.quantity")}
                  </label>
                  <input
                    id="amountInput"
                    data-cy="amount-input"
                    type="number"
                    min="0"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={amountInput}
                    onChange={(evt) =>
                      setAmountInput(parseInt(evt.target.value, 10))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="qualityInput" className="block text-gray-300">
                    {t("common.quality")}
                  </label>
                  <select
                    id="qualityInput"
                    type="range"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={qualityInput}
                    onChange={(evt) => setQualityInput(evt.target.value)}
                  >
                    <option value="0">{t("crafting.common")}</option>
                    <option value="1">{t("crafting.uncommon")}</option>
                    <option value="2">{t("crafting.rare")}</option>
                    <option value="3">{t("crafting.epic")}</option>
                    <option value="4">{t("crafting.legendary")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="priceInput" className="block text-gray-300">
                    {t("trades.pricePerUnit")}
                  </label>
                  <input
                    id="priceInput"
                    data-cy="price-input"
                    type="number"
                    min="0"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={priceInput}
                    onChange={(evt) =>
                      setPriceInput(parseInt(evt.target.value, 10))
                    }
                  />
                </div>
                <div className="col-span-full">
                  <button
                    className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="submit"
                    value="Submit"
                  >
                    {t("trades.publish")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const renderTradeList = () => {
    if (!isLoaded) {
      return <LoadingScreen />;
    }
    if (trades) {
      return trades.map((trade) => (
        <Trade
          key={`trade${trade.idtrade}`}
          trade={trade}
          onDelete={handleDeleteTrade}
        />
      ));
    }
    return "";
  };

  if (error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/profile",
        }}
      />
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Helmet>
        <title>Trades - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="Publish your trade offers or what you need to make it easy for others to trade with you"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trades - Stiletto for Last Oasis" />
        <meta
          name="twitter:description"
          content="Publish your trade offers or what you need to make it easy for others to trade with you"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/trades.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/trades`} />
      </Helmet>
      {renderLoggedPart()}
      <div className="w-full p-4">
        <div className="bg-gray-800 border border-blue-500 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">
            {t("trades.publishedTrades")}
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-1">
                <label
                  htmlFor="tradeTypeFilter"
                  className="block text-gray-300"
                >
                  {t("common.type")}
                </label>
              </div>
              <div className="lg:col-span-2">
                <select
                  id="tradeTypeFilter"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tradeTypeFilterInput}
                  onChange={(evt) =>
                    setTradeTypeFilterInput(evt.target.value)
                  }
                >
                  <option value="Supply">{t("common.supply")}</option>
                  <option value="Demand">{t("trades.demand")}</option>
                </select>
              </div>
              <div className="lg:col-span-1">
                <label
                  htmlFor="resourcetypefilter"
                  className="block text-gray-300"
                >
                  {t("trades.resource")}
                </label>
              </div>
              <div className="lg:col-span-2">
                <select
                  id="resourcetypefilter"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={resourceTypeFilterInput}
                  onChange={(evt) =>
                    setResourceTypeFilterInput(evt.target.value)
                  }
                >
                  {items?.map((item) => (
                    <option key={item.name} value={item.name}>
                      {t(item.name, { ns: "items" })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-1">
                <label
                  htmlFor="regionFilterInput"
                  className="block text-gray-300"
                >
                  {t("trades.region")}
                </label>
              </div>
              <div className="lg:col-span-2">
                <ClusterList
                  onError={setError}
                  value={regionFilterInput}
                  onChange={setRegionFilterInput}
                  filter={true}
                />
              </div>
              <div className="lg:col-span-3 flex space-x-2">
                <button
                  type="button"
                  className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => updateTrades()}
                >
                  {t("trades.filterTrades")}
                </button>
                <button
                  type="button"
                  className="flex-1 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => {
                    updateTrades();
                    setResourceTypeFilterInput("");
                    setTradeTypeFilterInput("");
                    setRegionFilterInput("");
                  }}
                >
                  {t("trades.cleanFilter")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderTradeList()}
        </div>
        <Pagination
          currentPage={page}
          hasMore={hasMore}
          onPrev={() => updateTrades(page - 1)}
          onNext={() => updateTrades(page + 1)}
        />
      </div>
    </div>
  );
};

export default TradeSystem;
