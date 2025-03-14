"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Item } from "@/types/items";
import { getItems } from "@/lib/services";
import Icon from "@/components/Icon";

interface Trade {
  id: string;
  userId: string;
  username: string;
  itemName: string;
  quantity: number;
  price: number;
  type: "buy" | "sell";
  createdAt: string;
}

export default function TradingPage() {
  const t = useTranslations();
  const [items, setItems] = useState<Item[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<"buy" | "sell">("sell");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadItems();
    loadTrades();
  }, []);

  const loadItems = async () => {
    try {
      const itemsData = await getItems();
      if (itemsData) {
        setItems(itemsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading items");
    }
  };

  const loadTrades = async () => {
    try {
      const response = await fetch("/api/trades");
      if (!response.ok) {
        throw new Error("Error loading trades");
      }
      const data = await response.json();
      setTrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading trades");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || quantity <= 0 || price <= 0) {
      return;
    }

    try {
      const response = await fetch("/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: selectedItem,
          quantity,
          price,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error("Error creating trade");
      }

      const newTrade = await response.json();
      setTrades((prev) => [newTrade, ...prev]);
      setSelectedItem("");
      setQuantity(1);
      setPrice(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating trade");
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {t(error)}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title h5 mb-0">{t("Create Trade")}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    {t("Type")}
                  </label>
                  <select
                    id="type"
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value as "buy" | "sell")}
                  >
                    <option value="sell">{t("Sell")}</option>
                    <option value="buy">{t("Buy")}</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="item" className="form-label">
                    {t("Item")}
                  </label>
                  <select
                    id="item"
                    className="form-select"
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    <option value="">{t("Select an item")}</option>
                    {items.map((item) => (
                      <option key={item.name} value={item.name}>
                        {t(item.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">
                    {t("Quantity")}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    {t("Price")}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min="0"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {t("Create Trade")}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title h5 mb-0">{t("Active Trades")}</h2>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>{t("Item")}</th>
                      <th>{t("Type")}</th>
                      <th>{t("Quantity")}</th>
                      <th>{t("Price")}</th>
                      <th>{t("User")}</th>
                      <th>{t("Date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade) => (
                      <tr key={trade.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Icon name={trade.itemName} />
                            <span className="ms-2">{t(trade.itemName)}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              trade.type === "buy" ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {t(trade.type)}
                          </span>
                        </td>
                        <td>{trade.quantity}</td>
                        <td>{trade.price}</td>
                        <td>{trade.username}</td>
                        <td>
                          {new Date(trade.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
