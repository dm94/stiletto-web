import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getItems, getStoredItem } from "../services";
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
      setError("Error connecting to the API");
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
          it.name === "Primitive Bandage"
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
      setError("Error connecting to the API");
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
      setError("Try again later");
    }
  };

  const renderLoggedPart = () => {
    if (!userDiscordId) {
      return (
        <div className="col-xl-6">
          <div className="card border-secondary mb-3">
            <div className="card-body text-succes">
              {t(
                "If you want to publish your own exchange offers you have to be connected"
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="col-xl-12">
        <form onSubmit={handleCreateTrade}>
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Publish a trade")}</div>
            <div className="card-body">
              <div className="row">
                <div className="form-group col-xl-2">
                  <label htmlFor="tradeType">{t("Type")}</label>
                  <select
                    id="tradeType"
                    className="custom-select"
                    value={tradeTypeInput}
                    onChange={(evt) => setTradeTypeInput(evt.target.value)}
                  >
                    <option value="Supply">{t("Supply")}</option>
                    <option value="Demand">{t("Demand")}</option>
                  </select>
                </div>
                <div className="form-group col-xl-2">
                  <label htmlFor="resourcetype">
                    {t("Resource or mats for")}
                  </label>
                  <select
                    id="resourcetype"
                    className="custom-select"
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
                <div className="form-group col-xl-2">
                  <label htmlFor="regionInput">{t("Region")}</label>
                  <ClusterList
                    onError={setError}
                    value={regionInput}
                    onChange={setRegionInput}
                    filter={false}
                  />
                </div>
                <div className="form-group col-xl-2">
                  <label htmlFor="amountInput">{t("Quantity")}</label>
                  <input
                    type="number"
                    id="amountInput"
                    className="form-control"
                    value={amountInput}
                    min="0"
                    onChange={(evt) => setAmountInput(evt.target.value)}
                  />
                </div>
                <div className="form-group col-xl-2">
                  <label htmlFor="qualityInput">{t("Quality")}</label>
                  <select
                    id="qualityInput"
                    type="range"
                    className="custom-select"
                    value={qualityInput}
                    onChange={(evt) => setQualityInput(evt.target.value)}
                  >
                    <option value="0">{t("Common")}</option>
                    <option value="1">{t("Uncommon")}</option>
                    <option value="2">{t("Rare")}</option>
                    <option value="3">{t("Epic")}</option>
                    <option value="4">{t("Legendary")}</option>
                  </select>
                </div>
                <div className="form-group col-xl-2">
                  <label htmlFor="priceInput">{t("Price per unit")}</label>
                  <input
                    id="priceInput"
                    type="number"
                    className="form-control"
                    min="0"
                    value={priceInput}
                    onChange={(evt) => setPriceInput(evt.target.value)}
                  />
                </div>
                <div className="form-group col-xl-12">
                  <button
                    className="btn btn-lg btn-success btn-block"
                    type="submit"
                    value="Submit"
                  >
                    {t("Publish")}
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
    <div className="row">
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
      <div className="col-md-12">
        <div className="card mb-3 border-primary">
          <div className="card-header">{t("Published Trades")}</div>
          <div className="card-body">
            <div className="row">
              <div className="col-1">
                <label htmlFor="tradeTypeFilter">{t("Type")}</label>
              </div>
              <div className="col-xl-2">
                <select
                  id="tradeTypeFilter"
                  className="custom-select"
                  value={tradeTypeFilterInput}
                  onChange={(evt) => setTradeTypeFilterInput(evt.target.value)}
                >
                  <option value="Supply">{t("Supply")}</option>
                  <option value="Demand">{t("Demand")}</option>
                </select>
              </div>
              <div className="col-1">
                <label htmlFor="resourcetypefilter">{t("Resource")}</label>
              </div>
              <div className="col-xl-2">
                <select
                  id="resourcetypefilter"
                  className="custom-select"
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
              <div className="col-1">
                <label htmlFor="regionFilterInput">{t("Region")}</label>
              </div>
              <div className="col-xl-2">
                <ClusterList
                  onError={setError}
                  value={regionFilterInput}
                  onChange={setRegionFilterInput}
                  filter={true}
                />
              </div>
              <div className="col-xl-3 btn-group">
                <button
                  type="button"
                  className="btn btn-lg btn-primary"
                  onClick={() => updateTrades()}
                >
                  {t("Filter trades")}
                </button>
                <button
                  type="button"
                  className="btn btn-lg btn-secondary"
                  onClick={() => {
                    updateTrades();
                    setResourceTypeFilterInput("");
                    setTradeTypeFilterInput("");
                    setRegionFilterInput("");
                  }}
                >
                  {t("Clean filter")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="row">{renderTradeList()}</div>
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
