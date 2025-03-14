"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem, closeSession } from "@/lib/services";

interface MemberPermissionsConfigProps {
  clanid?: string;
  memberid?: string;
  onClose?: () => void;
  onError?: (error: string) => void;
}

interface Permissions {
  bot: boolean;
  diplomacy: boolean;
  kickmembers: boolean;
  request: boolean;
  walkers: boolean;
}

const initialPermissions: Permissions = {
  bot: false,
  diplomacy: false,
  kickmembers: false,
  request: false,
  walkers: false,
};

export default function MemberPermissionsConfig({
  clanid,
  memberid,
  onClose,
  onError,
}: MemberPermissionsConfigProps) {
  const t = useTranslations();
  const [permissions, setPermissions] =
    useState<Permissions>(initialPermissions);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!clanid || !memberid) {
        return;
      }

      try {
        const response = await fetch(
          `${config.API_URL}/clans/${clanid}/members/${memberid}/permissions`,
          {
            headers: {
              Authorization: `Bearer ${getStoredItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setPermissions({
            bot: data.bot === "1",
            diplomacy: data.diplomacy === "1",
            kickmembers: data.kickmembers === "1",
            request: data.request === "1",
            walkers: data.walkers === "1",
          });
        } else if (response.status === 401) {
          closeSession();
          onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
        } else if (response.status === 503) {
          onError?.("Error al conectar con la base de datos");
        }
      } catch {
        onError?.("Error al conectar con la API");
      }
    };

    fetchPermissions();
  }, [clanid, memberid, onError]);

  const handleUpdatePermissions = async () => {
    if (!clanid || !memberid) {
      return;
    }

    try {
      const response = await fetch(
        `${config.API_URL}/clans/${clanid}/members/${memberid}/permissions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
          body: JSON.stringify(permissions),
        }
      );

      if (response.status === 200) {
        onClose?.();
      } else if (response.status === 401) {
        closeSession();
        onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
      } else if (response.status === 503) {
        onError?.("Error al conectar con la base de datos");
      }
    } catch {
      onError?.("Error al conectar con la API");
    }
  };

  return (
    <div className="modal d-block" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("Member Permissions")}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label={t("Close")}
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            <div className="form-group">
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="botPermission"
                  checked={permissions.bot}
                  onChange={(e) =>
                    setPermissions({ ...permissions, bot: e.target.checked })
                  }
                />
                <label className="form-check-label" htmlFor="botPermission">
                  {t("Bot")}
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="diplomacyPermission"
                  checked={permissions.diplomacy}
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      diplomacy: e.target.checked,
                    })
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="diplomacyPermission"
                >
                  {t("Diplomacy")}
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="kickmembersPermission"
                  checked={permissions.kickmembers}
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      kickmembers: e.target.checked,
                    })
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="kickmembersPermission"
                >
                  {t("Kick Members")}
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="requestPermission"
                  checked={permissions.request}
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      request: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="requestPermission">
                  {t("Accept/Reject Requests")}
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="walkersPermission"
                  checked={permissions.walkers}
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      walkers: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="walkersPermission">
                  {t("Manage Walkers")}
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {t("Close")}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdatePermissions}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
