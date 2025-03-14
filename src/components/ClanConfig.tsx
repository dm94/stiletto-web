"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import ClusterList from "./ClusterList";
import { config } from "@/config/config";
import { getStoredItem, closeSession } from "@/lib/services";

interface ClanConfigProps {
  clanid?: string;
  onClose?: () => void;
  onError?: (error: string) => void;
}

interface FormState {
  addClanNameInput: string;
  addClanColorInput: string;
  addClanDiscordInput: string;
  clanFlagSymbolInput: string;
  regionInput: string;
  recruitInput: boolean;
}

const initialFormState: FormState = {
  addClanNameInput: "",
  addClanColorInput: "#000000",
  addClanDiscordInput: "",
  clanFlagSymbolInput: "C1",
  regionInput: "EU-Official",
  recruitInput: true,
};

export default function ClanConfig({
  clanid,
  onClose,
  onError,
}: ClanConfigProps) {
  const t = useTranslations();
  const [formState, setFormState] = useState<FormState>(initialFormState);

  useEffect(() => {
    const fetchClanData = async () => {
      if (!clanid) {
        return;
      }

      try {
        const response = await fetch(`${config.API_URL}/clans/${clanid}`, {
          headers: {
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          if (data) {
            setFormState({
              addClanNameInput: data.name,
              addClanColorInput: data.flagcolor,
              addClanDiscordInput: data.invitelink,
              clanFlagSymbolInput: data.symbol,
              regionInput: data.region,
              recruitInput: data.recruitment,
            });
          }
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

    fetchClanData();
  }, [clanid, onError]);

  const handleCreateClan = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.API_URL}/clans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
        body: JSON.stringify({
          clanname: formState.addClanNameInput,
          clancolor: formState.addClanColorInput,
          clandiscord: formState.addClanDiscordInput,
          symbol: formState.clanFlagSymbolInput,
          region: formState.regionInput,
          recruit: formState.recruitInput,
        }),
      });

      if (response.status === 201) {
        onClose?.();
      } else if (response.status === 401) {
        onClose?.();
        closeSession();
        onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
      } else if (response.status === 503 || response.status === 205) {
        onError?.("Error al conectar con la base de datos");
      }
    } catch {
      onClose?.();
      onError?.("Error al conectar con la API");
    }
  };

  const handleUpdateClan = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.API_URL}/clans/${clanid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
        body: JSON.stringify({
          clanname: formState.addClanNameInput,
          clancolor: formState.addClanColorInput,
          clandiscord: formState.addClanDiscordInput,
          symbol: formState.clanFlagSymbolInput,
          region: formState.regionInput,
          recruit: formState.recruitInput,
        }),
      });

      if (response.status === 200) {
        onClose?.();
      } else if (response.status === 401) {
        onClose?.();
        closeSession();
        onError?.("No tienes acceso aquí, intenta iniciar sesión de nuevo");
      } else if (response.status === 503 || response.status === 205) {
        onError?.("Error al conectar con la base de datos");
      }
    } catch {
      onClose?.();
      onError?.("Error al conectar con la API");
    }
  };

  const renderSymbolsList = () => {
    const symbols = Array.from({ length: 30 }, (_, i) => `C${i + 1}`);

    return symbols.map((symbol) => (
      <button
        type="button"
        className="col-3"
        key={`symbol-${symbol}`}
        onClick={() =>
          setFormState({ ...formState, clanFlagSymbolInput: symbol })
        }
      >
        <img
          src={`${config.RESOURCES_URL}/symbols/${symbol}.png`}
          className={
            symbol === formState.clanFlagSymbolInput
              ? "img-fluid img-thumbnail"
              : "img-fluid"
          }
          alt={symbol}
          id={`symbol-img-${symbol}`}
        />
      </button>
    ));
  };

  return (
    <div className="modal d-block" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("Clan Configuration")}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label={t("Close")}
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            <form
              onSubmit={clanid ? handleUpdateClan : handleCreateClan}
              id="clanconfig"
            >
              <div className="form-group mb-3">
                <label htmlFor="clan_name" className="form-label">
                  {t("Clan Name")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clan_name"
                  name="clan_name"
                  maxLength={20}
                  value={formState.addClanNameInput}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      addClanNameInput: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="regionInput" className="form-label">
                  {t("Region")}
                </label>
                <ClusterList
                  value={formState.regionInput}
                  onChange={(value) =>
                    setFormState({ ...formState, regionInput: value })
                  }
                  filter={false}
                />
              </div>
              <div className="form-group mb-3">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="recruitmentInput"
                    checked={formState.recruitInput}
                    onChange={() =>
                      setFormState({
                        ...formState,
                        recruitInput: !formState.recruitInput,
                      })
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="recruitmentInput"
                  >
                    {t("Looking for new members?")}{" "}
                    {t(
                      "By disabling this option the clan does not appear in the clan list."
                    )}
                  </label>
                </div>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="discord_invite" className="form-label">
                  {t("Discord Invite Link")} {t("(Optional)")}
                </label>
                <div className="input-group">
                  <span className="input-group-text">https://discord.gg/</span>
                  <input
                    type="text"
                    className="form-control"
                    id="discord_invite"
                    name="discord_invite"
                    maxLength={10}
                    value={formState.addClanDiscordInput}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        addClanDiscordInput: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="flag_color" className="form-label">
                  {t("Flag Color")} {t("(Optional)")}
                </label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  id="flag_color"
                  name="flag_color"
                  value={formState.addClanColorInput}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      addClanColorInput: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="sigilClanFlagInput" className="form-label">
                  {t("Symbol")} {t("(Optional)")}
                </label>
                <div className="row g-2">{renderSymbolsList()}</div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {t("Close")}
            </button>
            <button className="btn btn-primary" form="clanconfig" type="submit">
              {clanid ? t("Save") : t("Create a clan")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
