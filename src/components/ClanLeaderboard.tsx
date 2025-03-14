"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem } from "@/lib/services";
import Icon from "@/components/Icon";

interface ClanRanking {
  id: string;
  name: string;
  tag: string;
  region: string;
  score: number;
  members: number;
  resourceCount: number;
  mapCount: number;
  tradeCount: number;
  rank: number;
  previousRank?: number;
}

interface ClanLeaderboardProps {
  onError?: (error: string) => void;
}

type SortField =
  | "score"
  | "members"
  | "resourceCount"
  | "mapCount"
  | "tradeCount";

export default function ClanLeaderboard({ onError }: ClanLeaderboardProps) {
  const t = useTranslations();
  const [clans, setClans] = useState<ClanRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("score");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `${config.API_URL}/clans/leaderboard?sort=${sortField}${
            selectedRegion ? `&region=${selectedRegion}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${getStoredItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setClans(data);
        } else if (response.status === 401) {
          onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
        }
      } catch {
        onError?.("Error al cargar la clasificación");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sortField, selectedRegion, onError]);

  const handleSortChange = (field: SortField) => {
    setSortField(field);
  };

  const getRankChangeIcon = (clan: ClanRanking) => {
    if (!clan.previousRank) {
      return null;
    }

    if (clan.rank < clan.previousRank) {
      return <i className="fas fa-arrow-up text-success" />;
    }

    if (clan.rank > clan.previousRank) {
      return <i className="fas fa-arrow-down text-danger" />;
    }

    return <i className="fas fa-minus text-muted" />;
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

  const regions = Array.from(new Set(clans.map((clan) => clan.region)));

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <Icon name="trophy" /> {t("Clan Leaderboard")}
          </h5>
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">{t("All Regions")}</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {t(region)}
                </option>
              ))}
            </select>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn btn${
                  sortField === "score" ? "" : "-outline"
                }-primary`}
                onClick={() => handleSortChange("score")}
              >
                {t("Score")}
              </button>
              <button
                type="button"
                className={`btn btn${
                  sortField === "members" ? "" : "-outline"
                }-primary`}
                onClick={() => handleSortChange("members")}
              >
                {t("Members")}
              </button>
              <button
                type="button"
                className={`btn btn${
                  sortField === "resourceCount" ? "" : "-outline"
                }-primary`}
                onClick={() => handleSortChange("resourceCount")}
              >
                {t("Resources")}
              </button>
              <button
                type="button"
                className={`btn btn${
                  sortField === "mapCount" ? "" : "-outline"
                }-primary`}
                onClick={() => handleSortChange("mapCount")}
              >
                {t("Maps")}
              </button>
              <button
                type="button"
                className={`btn btn${
                  sortField === "tradeCount" ? "" : "-outline"
                }-primary`}
                onClick={() => handleSortChange("tradeCount")}
              >
                {t("Trades")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>{t("Rank")}</th>
                <th>{t("Clan")}</th>
                <th>{t("Region")}</th>
                <th>{t("Score")}</th>
                <th>{t("Members")}</th>
                <th>{t("Resources")}</th>
                <th>{t("Maps")}</th>
                <th>{t("Trades")}</th>
              </tr>
            </thead>
            <tbody>
              {clans.map((clan) => (
                <tr key={clan.id}>
                  <td>
                    {clan.rank} {getRankChangeIcon(clan)}
                  </td>
                  <td>
                    [{clan.tag}] {clan.name}
                  </td>
                  <td>{t(clan.region)}</td>
                  <td>{clan.score.toLocaleString()}</td>
                  <td>{clan.members}</td>
                  <td>{clan.resourceCount}</td>
                  <td>{clan.mapCount}</td>
                  <td>{clan.tradeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
