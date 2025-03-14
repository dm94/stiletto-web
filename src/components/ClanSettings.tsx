"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/config/config";
import { getStoredItem } from "@/lib/services";
import Icon from "@/components/Icon";

interface ClanSettings {
  name: string;
  tag: string;
  description: string;
  region: string;
  discord_webhook?: string;
  notifications: {
    new_members: boolean;
    member_left: boolean;
    role_changes: boolean;
    map_updates: boolean;
    trade_alerts: boolean;
  };
  privacy: {
    hideMembers: boolean;
    hideMaps: boolean;
    hideResources: boolean;
  };
}

interface ClanSettingsProps {
  settings: ClanSettings;
  regions: string[];
  onSave: (settings: ClanSettings) => Promise<void>;
  onError?: (error: string) => void;
}

export default function ClanSettings({
  settings: initialSettings,
  regions,
  onSave,
  onError,
}: ClanSettingsProps) {
  const t = useTranslations();
  const [settings, setSettings] = useState<ClanSettings>(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!settings.name.trim() || !settings.tag.trim()) {
      onError?.("El nombre y tag del clan son requeridos");
      return;
    }

    try {
      setLoading(true);
      await onSave(settings);
    } catch {
      onError?.("Error al guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ClanSettings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (
    field: keyof ClanSettings["notifications"]
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field],
      },
    }));
  };

  const handlePrivacyChange = (field: keyof ClanSettings["privacy"]) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: !prev.privacy[field],
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-cog me-2" />
                {t("General Settings")}
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  {t("Clan Name")}
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={settings.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tag" className="form-label">
                  {t("Clan Tag")}
                </label>
                <input
                  type="text"
                  id="tag"
                  className="form-control"
                  value={settings.tag}
                  onChange={(e) => handleInputChange("tag", e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  {t("Description")}
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  rows={3}
                  value={settings.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="region" className="form-label">
                  {t("Region")}
                </label>
                <select
                  id="region"
                  className="form-select"
                  value={settings.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  required
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="discord_webhook" className="form-label">
                  {t("Discord Webhook URL")}
                </label>
                <input
                  type="url"
                  id="discord_webhook"
                  className="form-control"
                  value={settings.discord_webhook}
                  onChange={(e) =>
                    handleInputChange("discord_webhook", e.target.value)
                  }
                  placeholder="https://discord.com/api/webhooks/..."
                />
                <div className="form-text">
                  {t("Optional Discord integration")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-bell me-2" />
                {t("Notifications")}
              </h5>
            </div>
            <div className="card-body">
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  id="new_members"
                  className="form-check-input"
                  checked={settings.notifications.new_members}
                  onChange={() => handleNotificationChange("new_members")}
                />
                <label htmlFor="new_members" className="form-check-label">
                  {t("New member notifications")}
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  id="member_left"
                  className="form-check-input"
                  checked={settings.notifications.member_left}
                  onChange={() => handleNotificationChange("member_left")}
                />
                <label htmlFor="member_left" className="form-check-label">
                  {t("Member left notifications")}
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  id="role_changes"
                  className="form-check-input"
                  checked={settings.notifications.role_changes}
                  onChange={() => handleNotificationChange("role_changes")}
                />
                <label htmlFor="role_changes" className="form-check-label">
                  {t("Role change notifications")}
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  id="map_updates"
                  className="form-check-input"
                  checked={settings.notifications.map_updates}
                  onChange={() => handleNotificationChange("map_updates")}
                />
                <label htmlFor="map_updates" className="form-check-label">
                  {t("Map update notifications")}
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="trade_alerts"
                  className="form-check-input"
                  checked={settings.notifications.trade_alerts}
                  onChange={() => handleNotificationChange("trade_alerts")}
                />
                <label htmlFor="trade_alerts" className="form-check-label">
                  {t("Trade alert notifications")}
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-lock me-2" />
                {t("Privacy Settings")}
              </h5>
            </div>
            <div className="card-body">
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  id="hideMembers"
                  className="form-check-input"
                  checked={settings.privacy.hideMembers}
                  onChange={() => handlePrivacyChange("hideMembers")}
                />
                <label htmlFor="hideMembers" className="form-check-label">
                  {t("Hide member list from non-members")}
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  id="hideMaps"
                  className="form-check-input"
                  checked={settings.privacy.hideMaps}
                  onChange={() => handlePrivacyChange("hideMaps")}
                />
                <label htmlFor="hideMaps" className="form-check-label">
                  {t("Hide maps from non-members")}
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="hideResources"
                  className="form-check-input"
                  checked={settings.privacy.hideResources}
                  onChange={() => handlePrivacyChange("hideResources")}
                />
                <label htmlFor="hideResources" className="form-check-label">
                  {t("Hide resource information from non-members")}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2" />
              {t("Saving...")}
            </>
          ) : (
            <>
              <i className="fas fa-save me-2" />
              {t("Save Changes")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
