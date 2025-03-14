"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem } from "@/lib/services";

interface ClanMember {
  discordid: string;
  discordtag: string;
  role: "owner" | "admin" | "member";
  joinDate: string;
  lastActive: string;
  permissions: string[];
}

interface ClanMemberListProps {
  members: ClanMember[];
  currentUserRole: ClanMember["role"];
  onUpdateRole: (
    memberId: string,
    newRole: ClanMember["role"]
  ) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onUpdatePermissions: (
    memberId: string,
    permissions: string[]
  ) => Promise<void>;
  onError?: (error: string) => void;
}

export default function ClanMemberList({
  members,
  currentUserRole,
  onUpdateRole,
  onRemoveMember,
  onUpdatePermissions,
  onError,
}: ClanMemberListProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [editingPermissions, setEditingPermissions] = useState<string | null>(
    null
  );

  const canManageRoles =
    currentUserRole === "owner" || currentUserRole === "admin";
  const canManagePermissions = currentUserRole === "owner";

  const getRoleBadgeColor = (role: ClanMember["role"]) => {
    switch (role) {
      case "owner":
        return "bg-danger";
      case "admin":
        return "bg-warning";
      default:
        return "bg-primary";
    }
  };

  const handleRoleChange = async (
    memberId: string,
    newRole: ClanMember["role"]
  ) => {
    try {
      setLoading((prev) => ({ ...prev, [`role_${memberId}`]: true }));
      await onUpdateRole(memberId, newRole);
    } catch {
      onError?.("Error al actualizar el rol del miembro");
    } finally {
      setLoading((prev) => ({ ...prev, [`role_${memberId}`]: false }));
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm(t("Are you sure you want to remove this member?"))) {
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [`remove_${memberId}`]: true }));
      await onRemoveMember(memberId);
    } catch {
      onError?.("Error al eliminar al miembro");
    } finally {
      setLoading((prev) => ({ ...prev, [`remove_${memberId}`]: false }));
    }
  };

  const handlePermissionsChange = async (
    memberId: string,
    permissions: string[]
  ) => {
    try {
      setLoading((prev) => ({ ...prev, [`permissions_${memberId}`]: true }));
      await onUpdatePermissions(memberId, permissions);
      setEditingPermissions(null);
    } catch {
      onError?.("Error al actualizar los permisos");
    } finally {
      setLoading((prev) => ({ ...prev, [`permissions_${memberId}`]: false }));
    }
  };

  const availablePermissions = [
    "manage_maps",
    "manage_trades",
    "manage_resources",
    "view_analytics",
  ];

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>{t("Member")}</th>
            <th>{t("Role")}</th>
            <th>{t("Join Date")}</th>
            <th>{t("Last Active")}</th>
            <th>{t("Permissions")}</th>
            {canManageRoles && <th>{t("Actions")}</th>}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.discordid}>
              <td>{member.discordtag}</td>
              <td>
                {canManageRoles && member.role !== "owner" ? (
                  <select
                    className="form-select form-select-sm w-auto"
                    value={member.role}
                    onChange={(e) =>
                      handleRoleChange(
                        member.discordid,
                        e.target.value as ClanMember["role"]
                      )
                    }
                    disabled={loading[`role_${member.discordid}`]}
                  >
                    <option value="admin">{t("Admin")}</option>
                    <option value="member">{t("Member")}</option>
                  </select>
                ) : (
                  <span className={`badge ${getRoleBadgeColor(member.role)}`}>
                    {t(member.role)}
                  </span>
                )}
              </td>
              <td>{new Date(member.joinDate).toLocaleDateString()}</td>
              <td>{new Date(member.lastActive).toLocaleString()}</td>
              <td>
                {editingPermissions === member.discordid ? (
                  <div className="d-flex gap-2 align-items-center">
                    <select
                      className="form-select form-select-sm"
                      multiple
                      value={member.permissions}
                      onChange={(e) => {
                        const selected = Array.from(
                          e.target.selectedOptions
                        ).map((option) => option.value);
                        handlePermissionsChange(member.discordid, selected);
                      }}
                      disabled={loading[`permissions_${member.discordid}`]}
                    >
                      {availablePermissions.map((permission) => (
                        <option key={permission} value={permission}>
                          {t(permission)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setEditingPermissions(null)}
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                ) : (
                  <div className="d-flex gap-1 flex-wrap">
                    {member.permissions.map((permission) => (
                      <span key={permission} className="badge bg-secondary">
                        {t(permission)}
                      </span>
                    ))}
                    {canManagePermissions && member.role !== "owner" && (
                      <button
                        type="button"
                        className="btn btn-sm btn-link p-0 ms-1"
                        onClick={() => setEditingPermissions(member.discordid)}
                      >
                        <i className="fas fa-edit" />
                      </button>
                    )}
                  </div>
                )}
              </td>
              {canManageRoles && (
                <td>
                  {member.role !== "owner" &&
                    member.discordid !== getStoredItem("discordid") && (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveMember(member.discordid)}
                        disabled={loading[`remove_${member.discordid}`]}
                      >
                        {loading[`remove_${member.discordid}`] ? (
                          <i className="fas fa-spinner fa-spin" />
                        ) : (
                          <i className="fas fa-trash" />
                        )}
                      </button>
                    )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
