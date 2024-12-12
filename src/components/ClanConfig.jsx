import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { closeSession, getStoredItem } from "../services";
import ClusterList from "./ClusterList";
import { config } from "../config/config";
import { updateClan, createClan } from "../functions/requests/clan";

const ClanConfig = ({ clanid, onClose, onError }) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({
    addClanNameInput: "",
    addClanColorInput: "#000000",
    addClanDiscordInput: "",
    clanFlagSymbolInput: "C1",
    regionInput: "EU-Official",
    recruitInput: true,
  });

  useEffect(() => {
    const fetchClanData = async () => {
      if (!clanid) {
        return false;
      }

      try {
        const response = await fetch(
          `${config.REACT_APP_API_URL}/clans/${clanid}`,
          {
            headers: {
              Authorization: `Bearer ${getStoredItem("token")}`,
            },
          }
        );

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
          onError?.("You don't have access here, try to log in again");
        } else if (response.status === 503) {
          onError?.("Error connecting to database");
        }
      } catch {
        onError?.("Error when connecting to the API");
      }
    };

    fetchClanData();
  }, [clanid, onError]);

  const handleCreateClan = async (e) => {
    e.preventDefault();

    try {
      const response = await createClan({
        clanname: formState.addClanNameInput,
        clancolor: formState.addClanColorInput,
        clandiscord: formState.addClanDiscordInput,
        symbol: formState.clanFlagSymbolInput,
        region: formState.regionInput,
        recruit: formState.recruitInput,
      });

      if (response.status === 201) {
        onClose?.();
      } else if (response.status === 401) {
        onClose?.();
        closeSession();
        onError?.("You don't have access here, try to log in again");
      } else if (response.status === 503 || response.status === 205) {
        onError?.("Error connecting to database");
      }
    } catch {
      onClose?.();
      onError?.("Error when connecting to the API");
    }
  };

  const handleUpdateClan = async (e) => {
    e.preventDefault();

    try {
      const response = await updateClan(clanid, {
        clanname: formState.addClanNameInput,
        clancolor: formState.addClanColorInput,
        clandiscord: formState.addClanDiscordInput,
        symbol: formState.clanFlagSymbolInput,
        region: formState.regionInput,
        recruit: formState.recruitInput,
      });

      if (response.status === 200) {
        onClose?.();
      } else if (response.status === 401) {
        onClose?.();
        closeSession();
        onError?.("You don't have access here, try to log in again");
      } else if (response.status === 503 || response.status === 205) {
        onError?.("Error connecting to database");
      }
    } catch {
      onClose?.();
      onError?.("Error when connecting to the API");
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
          src={`${config.REACT_APP_RESOURCES_URL}/symbols/${symbol}.png`}
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
    <div className="modal d-block" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("Clan Configuration")}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">X</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              onSubmit={clanid ? handleUpdateClan : handleCreateClan}
              id="clanconfig"
            >
              <div className="form-group">
                <label htmlFor="clan_name">{t("Clan Name")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="clan_name"
                  name="clan_name"
                  maxLength="20"
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
              <div className="form-group">
                <label htmlFor="regionInput">{t("Region")}</label>
                <ClusterList
                  onError={(error) => onError?.(error)}
                  value={formState.regionInput}
                  onChange={(value) =>
                    setFormState({ ...formState, regionInput: value })
                  }
                  filter={false}
                />
              </div>
              <div className="form-group">
                <div className="custom-control custom-switch my-1">
                  <input
                    type="checkbox"
                    className="custom-control-input"
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
                    className="custom-control-label"
                    htmlFor="recruitmentInput"
                  >
                    {t("Looking for new members?")}{" "}
                    {t(
                      "By disabling this option the clan does not appear in the clan list."
                    )}
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="discord_invite">
                  {t("Discord Invite Link")} {t("(Optional)")}
                </label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      https://discord.gg/
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="discord_invite"
                    name="discord_invite"
                    maxLength="10"
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
              <div className="form-group">
                <label htmlFor="flag_color">
                  {t("Flag Color")} {t("(Optional)")}
                </label>
                <input
                  type="color"
                  className="form-control"
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
              <div className="form-group">
                <label htmlFor="sigilClanFlagInput">
                  {t("Symbol")} {t("(Optional)")}
                </label>
                <div className="col-12">
                  <div className="row">{renderSymbolsList()}</div>
                </div>
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
            <button
              className="btn btn-primary"
              form="clanconfig"
              type="submit"
              value="Submit"
            >
              {clanid ? t("Save") : t("Create a clan")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClanConfig;
