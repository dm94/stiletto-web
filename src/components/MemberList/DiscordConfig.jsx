import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { closeSession } from "../../services";
import {
  getDiscordConfig,
  updateBotConfig,
} from "../../functions/requests/clans/discordbot";

const DiscordConfig = ({ clanid, onClose, onError }) => {
  const { t } = useTranslation();
  const [botConfig, setBotConfig] = useState({
    readClanLog: true,
    botLanguaje: "en",
    automaticKick: false,
    setNotReadyPVP: false,
    walkeralarm: false,
  });

  useEffect(() => {
    const fetchBotConfig = async () => {
      try {
        const response = await getDiscordConfig(clanid);

        if (response.status === 200) {
          const data = await response.json();
          if (data) {
            setBotConfig({
              botLanguaje: data.botlanguaje || "en",
              readClanLog: data.readclanlog === "1",
              automaticKick: data.automatickick === "1",
              setNotReadyPVP: data.setnotreadypvp === "1",
              walkeralarm: data.walkeralarm === "1",
            });
          }
        } else if (response.status === 401) {
          closeSession();
          onError("You don't have access here, try to log in again");
        } else if (response.status === 503) {
          onError("Error connecting to database");
        }
      } catch {
        onError("Your clan does not have a linked discord");
      }
    };

    fetchBotConfig();
  }, [clanid, onError]);

  const handleUpdateBotConfig = async () => {
    try {
      const response = await updateBotConfig(clanid, botConfig);

      if (response.status === 200) {
        onClose();
      } else if (response.status === 401) {
        closeSession();
        onError("You don't have access here, try to log in again");
        onClose();
      } else if (response.status === 503) {
        onError("Error connecting to database");
        onClose();
      }
    } catch {
      onError("Error when connecting to the API");
    }
  };

  const handleBotLanguageChange = (evt) => {
    setBotConfig({ ...botConfig, botLanguaje: evt.target.value });
  };

  const toggleConfigOption = (key) => {
    setBotConfig({ ...botConfig, [key]: !botConfig[key] });
  };

  return (
    <div className="modal d-block" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("Discord Bot Configuration")}</h5>
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
            <div className="form-group">
              <label htmlFor="botlanguaje">{t("Bot language")}</label>
              <select
                className="form-control"
                value={botConfig.botLanguaje}
                id="botlanguaje"
                onChange={handleBotLanguageChange}
              >
                <option value="en">{t("English")}</option>
                <option value="es">{t("Spanish")}</option>
                <option value="ru">{t("Russian")}</option>
                <option value="fr">{t("French")}</option>
                <option value="de">{t("German")}</option>
              </select>
            </div>
            <div
              className="custom-control custom-switch my-1"
              title={t(
                "If you want the bot to read the clan log, it is necessary for other functions."
              )}
            >
              <input
                type="checkbox"
                className="custom-control-input"
                id="readClanLog"
                checked={botConfig.readClanLog}
                onChange={() => toggleConfigOption("readClanLog")}
              />
              <label className="custom-control-label" htmlFor="readClanLog">
                {t("Read discord clan log.")}
              </label>
            </div>
            <div
              className="custom-control custom-switch my-1"
              title={t(
                "Read the clan log and if a member was kicked, kick from here too."
              )}
            >
              <input
                type="checkbox"
                className="custom-control-input"
                id="automaticKick"
                checked={botConfig.automaticKick}
                onChange={() => toggleConfigOption("automaticKick")}
              />
              <label className="custom-control-label" htmlFor="automaticKick">
                {t("Automatic kick members from the clan")}
              </label>
            </div>
            <div className="custom-control custom-switch my-1">
              <input
                type="checkbox"
                className="custom-control-input"
                id="setNotReadyPVP"
                checked={botConfig.setNotReadyPVP}
                onChange={() => toggleConfigOption("setNotReadyPVP")}
              />
              <label className="custom-control-label" htmlFor="setNotReadyPVP">
                {t(
                  "Automatically if a PVP walker is used it is marked as not ready."
                )}
              </label>
            </div>
            <div
              className="custom-control custom-switch my-1"
              title={t(
                "Read the clan log and if a member was kicked, kick from here too."
              )}
            >
              <input
                type="checkbox"
                className="custom-control-input"
                id="walkerAlarm"
                checked={botConfig.walkeralarm}
                onChange={() => toggleConfigOption("walkeralarm")}
              />
              <label className="custom-control-label" htmlFor="walkerAlarm">
                {t("Warns if someone brings out a walker they don't own.")}
              </label>
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
              onClick={handleUpdateBotConfig}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordConfig;
