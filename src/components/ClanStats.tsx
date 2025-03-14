"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem } from "@/lib/services";

interface ResourceStats {
  name: string;
  total: number;
  lastWeek: number;
  trend: "up" | "down" | "stable";
}

interface ActivityStats {
  activeMembersLast7Days: number;
  totalMapsUpdated: number;
  totalTradesCompleted: number;
  averageMemberActivity: number;
}

interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  membersByRole: {
    owner: number;
    admin: number;
    member: number;
  };
}

interface ClanStatsProps {
  clanId: string;
  onError?: (error: string) => void;
}

export default function ClanStats({ clanId, onError }: ClanStatsProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [resourceStats, setResourceStats] = useState<ResourceStats[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(
    null
  );
  const [memberStats, setMemberStats] = useState<MemberStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${config.API_URL}/clans/${clanId}/stats`,
          {
            headers: {
              Authorization: `Bearer ${getStoredItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setResourceStats(data.resources);
          setActivityStats(data.activity);
          setMemberStats(data.members);
        } else if (response.status === 401) {
          onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
        }
      } catch {
        onError?.("Error al cargar las estadísticas del clan");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [clanId, onError]);

  const getTrendIcon = (trend: ResourceStats["trend"]) => {
    switch (trend) {
      case "up":
        return <i className="fas fa-arrow-up text-success" />;
      case "down":
        return <i className="fas fa-arrow-down text-danger" />;
      default:
        return <i className="fas fa-equals text-warning" />;
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
    <div className="row g-4">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="fas fa-users me-2" />
              {t("Member Statistics")}
            </h5>
          </div>
          <div className="card-body">
            {memberStats && (
              <div className="row g-3">
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-1">{t("Total Members")}</h6>
                    <h3 className="mb-0">{memberStats.totalMembers}</h3>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-1">{t("Active Members")}</h6>
                    <h3 className="mb-0">{memberStats.activeMembers}</h3>
                  </div>
                </div>
                <div className="col-12">
                  <div className="border rounded p-3">
                    <h6 className="text-muted mb-3">{t("Members by Role")}</h6>
                    <div className="d-flex justify-content-around text-center">
                      <div>
                        <div className="badge bg-danger mb-2">
                          {memberStats.membersByRole.owner}
                        </div>
                        <div className="small">{t("Owner")}</div>
                      </div>
                      <div>
                        <div className="badge bg-warning mb-2">
                          {memberStats.membersByRole.admin}
                        </div>
                        <div className="small">{t("Admins")}</div>
                      </div>
                      <div>
                        <div className="badge bg-primary mb-2">
                          {memberStats.membersByRole.member}
                        </div>
                        <div className="small">{t("Members")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="fas fa-chart-line me-2" />
              {t("Activity Statistics")}
            </h5>
          </div>
          <div className="card-body">
            {activityStats && (
              <div className="row g-3">
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-1">
                      {t("Active Last 7 Days")}
                    </h6>
                    <h3 className="mb-0">
                      {activityStats.activeMembersLast7Days}
                    </h3>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-1">{t("Maps Updated")}</h6>
                    <h3 className="mb-0">{activityStats.totalMapsUpdated}</h3>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-1">{t("Trades Completed")}</h6>
                    <h3 className="mb-0">
                      {activityStats.totalTradesCompleted}
                    </h3>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-1">
                      {t("Avg. Member Activity")}
                    </h6>
                    <h3 className="mb-0">
                      {activityStats.averageMemberActivity}%
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="fas fa-cube me-2" />
              {t("Resource Statistics")}
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>{t("Resource")}</th>
                    <th>{t("Total")}</th>
                    <th>{t("Last Week")}</th>
                    <th>{t("Trend")}</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceStats.map((resource) => (
                    <tr key={resource.name}>
                      <td>{t(resource.name)}</td>
                      <td>{resource.total}</td>
                      <td>{resource.lastWeek}</td>
                      <td>{getTrendIcon(resource.trend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
