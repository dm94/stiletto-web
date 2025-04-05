import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getItems } from "../functions/services";
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
import { type TradeInfo, TradeType } from "../types/dto/trades";
import type { Item } from "../types/item";
import { getUser } from "../functions/requests/users";

const TradeSystem = () => {
  const { t } = useTranslation();
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [userDiscordId, setUserDiscordId] = useState<string>();
  const [trades, setTrades] = useState<TradeInfo[]>([]);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Item[]>([]);
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

  const loadProfile = useCallback(async () => {
    try {
      const userProfile = await getUser();
      if (userProfile?.discordid) {
        setUserDiscordId(userProfile.discordid);
        setIsLogged(true);
      }
    } catch {
      // Silent error
    }
  }, []);

  const updateRecipes = useCallback(async () => {
    try {
      const itemsData = await getItems();
      if (itemsData) {
        setItems(itemsData);
      }
    } catch {
      setError("errors.apiConnection");
    }
  }, []);

  const updateTrades = useCallback(
    async (currentPage = 1) => {
      try {
        setIsLoaded(false);
        setPage(currentPage);

        const tradesData = await getTrades({
          pageSize: 20,
          page: currentPage,
          ...(resourceTypeFilterInput.length > 0 && {
            resource: resourceTypeFilterInput,
          }),
          ...(tradeTypeFilterInput.length > 0 && {
            type: tradeTypeFilterInput as TradeType,
          }),
          ...(regionFilterInput.length > 0 && { region: regionFilterInput }),
        });

        const hasMore = tradesData != null && tradesData.length >= 20;
        setTrades(tradesData);
        setHasMore(hasMore);
        setIsLoaded(true);
      } catch {
        setError("errors.apiConnection");
      }
    },
    [resourceTypeFilterInput, tradeTypeFilterInput, regionFilterInput],
  );

  useEffect(() => {
    loadProfile();
    updateRecipes();
    updateTrades();
  }, [loadProfile, updateRecipes, updateTrades]);

  const handleDeleteTrade = useCallback(
    async (idTrade: number) => {
      try {
        await deleteTrade(idTrade);
        await updateTrades();
      } catch {
        setError("errors.errorConnectingToAPI");
      }
    },
    [updateTrades],
  );

  const handleClearButton = useCallback(async () => {
    setResourceTypeFilterInput("");
    setTradeTypeFilterInput("");
    setRegionFilterInput("");
  }, []);

  const handleCreateTrade = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        await createTrade({
          resource: resourceTypeInput,
          type: tradeTypeInput as TradeType,
          amount: amountInput,
          region: regionInput,
          quality: qualityInput,
          price: priceInput,
        });

        setResourceTypeInput(items[0].name);
        setTradeTypeInput(TradeType.Supply);
        setAmountInput(0);
        setRegionInput("EU");
        setQualityInput(0);
        setPriceInput(0);

        await updateTrades();
      } catch {
        setError("common.tryAgainLater");
      }
    },
    [
      resourceTypeInput,
      tradeTypeInput,
      amountInput,
      regionInput,
      qualityInput,
      priceInput,
      updateTrades,
      items,
    ],
  );

  const renderLoggedPart = () => {
    if (!isLogged) {
      return (
        <div className="w-full lg:w-1/2 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 text-green-400">
              {t("trades.publishTradeNotice")}
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
                    {t("common.region")}
                  </label>
                  <ClusterList
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
                      setAmountInput(Number.parseInt(evt.target.value, 10))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="qualityInput" className="block text-gray-300">
                    {t("common.quality")}
                  </label>
                  <select
                    id="qualityInput"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={qualityInput}
                    onChange={(evt) =>
                      setQualityInput(Number(evt.target.value))
                    }
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
                      setPriceInput(Number.parseInt(evt.target.value, 10))
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

  const renderTradeList = useMemo(() => {
    if (!isLoaded) {
      return <LoadingScreen />;
    }

    if (trades && trades.length > 0) {
      return trades.map((trade) => (
        <Trade
          key={`trade${trade.idtrade}`}
          trade={trade}
          userDiscordId={userDiscordId}
          onDelete={handleDeleteTrade}
        />
      ));
    }

    return (
      <div className="col-span-full text-center text-gray-400 py-8">
        {t("trades.noTradesFound")}
      </div>
    );
  }, [isLoaded, trades, userDiscordId, handleDeleteTrade, t]);

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
                  onChange={(evt) => setTradeTypeFilterInput(evt.target.value)}
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
                  {t("common.region")}
                </label>
              </div>
              <div className="lg:col-span-2">
                <ClusterList
                  value={regionFilterInput}
                  onChange={setRegionFilterInput}
                  filter={true}
                  id="regionFilterInput"
                />
              </div>
              <div className="lg:col-span-3 flex space-x-2">
                <button
                  type="button"
                  className="flex-1 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => handleClearButton()}
                >
                  {t("common.cleanFilter")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderTradeList}
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
