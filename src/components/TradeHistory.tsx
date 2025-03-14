"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem } from "@/lib/services";
import Icon from "@/components/Icon";

interface CompletedTrade {
  tradeid: string;
  itemid: string;
  itemname: string;
  quantity: number;
  price: number;
  type: "buy" | "sell";
  seller_discordtag: string;
  buyer_discordtag: string;
  completed_date: string;
  region: string;
}

interface TradeHistoryProps {
  onError?: (error: string) => void;
}

export default function TradeHistory({ onError }: TradeHistoryProps) {
  const t = useTranslations();
  const [trades, setTrades] = useState<CompletedTrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        const response = await fetch(`${config.API_URL}/trades/history`, {
          headers: {
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setTrades(data);
        } else if (response.status === 401) {
          onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
        }
      } catch {
        onError?.("Error al cargar el historial de trades");
      } finally {
        setLoading(false);
      }
    };

    fetchTradeHistory();
  }, [onError]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border">
          <span className="visually-hidden">{t("Loading...")}</span>
        </div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        {t("No completed trades found")}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">{t("Trade History")}</h5>
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
              <th>{t("Seller")}</th>
              <th>{t("Buyer")}</th>
              <th>{t("Completed Date")}</th>
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
                <td>{trade.seller_discordtag}</td>
                <td>{trade.buyer_discordtag}</td>
                <td>{new Date(trade.completed_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
