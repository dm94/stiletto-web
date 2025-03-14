"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem } from "@/lib/services";

interface Invite {
  id: string;
  discordtag: string;
  createdAt: string;
  expiresAt: string;
  createdBy: string;
}

interface ClanInviteProps {
  invites: Invite[];
  onCreateInvite: (discordtag: string) => Promise<void>;
  onRevokeInvite: (inviteId: string) => Promise<void>;
  onError?: (error: string) => void;
}

export default function ClanInvite({
  invites,
  onCreateInvite,
  onRevokeInvite,
  onError,
}: ClanInviteProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [discordTag, setDiscordTag] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!discordTag.trim()) {
      onError?.("Por favor, ingresa un Discord tag");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, create: true }));
      await onCreateInvite(discordTag);
      setDiscordTag("");
    } catch {
      onError?.("Error al crear la invitación");
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const handleRevoke = async (inviteId: string) => {
    if (
      !window.confirm(t("Are you sure you want to revoke this invitation?"))
    ) {
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [inviteId]: true }));
      await onRevokeInvite(inviteId);
    } catch {
      onError?.("Error al revocar la invitación");
    } finally {
      setLoading((prev) => ({ ...prev, [inviteId]: false }));
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">{t("Clan Invitations")}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={t("Enter Discord tag (e.g. username#0000)")}
              value={discordTag}
              onChange={(e) => setDiscordTag(e.target.value)}
              disabled={loading.create}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading.create}
            >
              {loading.create ? (
                <i className="fas fa-spinner fa-spin me-1" />
              ) : (
                <i className="fas fa-user-plus me-1" />
              )}
              {t("Invite")}
            </button>
          </div>
        </form>

        {invites.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>{t("Discord Tag")}</th>
                  <th>{t("Created By")}</th>
                  <th>{t("Created At")}</th>
                  <th>{t("Expires At")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.id}>
                    <td>{invite.discordtag}</td>
                    <td>{invite.createdBy}</td>
                    <td>{new Date(invite.createdAt).toLocaleString()}</td>
                    <td>{new Date(invite.expiresAt).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          isExpired(invite.expiresAt)
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {isExpired(invite.expiresAt)
                          ? t("Expired")
                          : t("Active")}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRevoke(invite.id)}
                        disabled={loading[invite.id]}
                      >
                        {loading[invite.id] ? (
                          <i className="fas fa-spinner fa-spin" />
                        ) : (
                          <i className="fas fa-times" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info" role="alert">
            {t("No active invitations")}
          </div>
        )}
      </div>
    </div>
  );
}
