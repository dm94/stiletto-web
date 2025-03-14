"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem, closeSession } from "@/lib/services";
import Icon from "@/components/Icon";

interface Item {
  id: string;
  name: string;
  category: string;
}

interface Trade {
  tradeid: string;
  itemid: string;
  itemname: string;
  quantity: number;
  price: number;
  type: "buy" | "sell";
  discordid: string;
  discordtag: string;
  date: string;
  region: string;
}

interface TradeProps {
  onError?: (error: string) => void;
}

export default function Trade({ onError }: TradeProps) {
  const t = useTranslations();
  const [items, setItems] = useState<Item[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<"buy" | "sell">("sell");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${config.API_URL}/items`);
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch {
        onError?.("Error al cargar los items");
      }
    };

    const fetchTrades = async () => {
      try {
        const response = await fetch(`${config.API_URL}/trades`, {
          headers: {
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setTrades(data);
        } else if (response.status === 401) {
          closeSession();
          onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
        }
      } catch {
        onError?.("Error al cargar los trades");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
    fetchTrades();
  }, [onError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      onError?.("Selecciona un item");
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/trades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
        body: JSON.stringify({
          itemid: selectedItem,
          quantity,
          price,
          type,
        }),
      });

      if (response.status === 201) {
        const newTrade = await response.json();
        setTrades([newTrade, ...trades]);
        setSelectedItem("");
        setQuantity(1);
        setPrice(0);
      } else if (response.status === 401) {
        closeSession();
        onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
      }
    } catch {
      onError?.("Error al crear el trade");
    }
  };

  const handleDelete = async (tradeid: string) => {
    try {
      const response = await fetch(`${config.API_URL}/trades/${tradeid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      });

      if (response.status === 204) {
        setTrades(trades.filter((trade) => trade.tradeid !== tradeid));
      } else if (response.status === 401) {
        closeSession();
        onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
      }
    } catch {
      onError?.("Error al eliminar el trade");
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border">
          <span className="visually-hidden">{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title mb-0">{t("Create Trade")}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="item" className="form-label">
                  {t("Item")}
                </label>
                <select
                  id="item"
                  className="form-select"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  required
                >
                  <option value="">{t("Select an item")}</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
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
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
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
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  {t("Type")}
                </label>
                <div className="btn-group w-100" id="type">
                  <button
                    type="button"
                    className={`btn ${
                      type === "sell" ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setType("sell")}
                  >
                    {t("Sell")}
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      type === "buy" ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setType("buy")}
                  >
                    {t("Buy")}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-success w-100">
                {t("Create")}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">{t("Active Trades")}</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>{t("Item")}</th>
                  <th>{t("Quantity")}</th>
                  <th>{t("Price")}</th>
                  <th>{t("Type")}</th>
                  <th>{t("Region")}</th>
                  <th>{t("User")}</th>
                  <th>{t("Date")}</th>
                  <th>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.tradeid}>
                    <td>
                      <Icon name={trade.itemname} /> {t(trade.itemname)}
                    </td>
                    <td>{trade.quantity}</td>
                    <td>{trade.price}</td>
                    <td>
                      <span
                        className={`badge ${
                          trade.type === "sell" ? "bg-success" : "bg-primary"
                        }`}
                      >
                        {t(trade.type)}
                      </span>
                    </td>
                    <td>{trade.region}</td>
                    <td>{trade.discordtag}</td>
                    <td>{new Date(trade.date).toLocaleDateString()}</td>
                    <td>
                      {trade.discordid === getStoredItem("discordid") && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(trade.tradeid)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
