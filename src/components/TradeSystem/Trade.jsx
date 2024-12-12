import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import { getStoredItem } from "../../services";

const Trade = ({ trade, onDelete }) => {
  const { t } = useTranslation();
  const userDiscordId = getStoredItem("discordid");

  const renderCardFooter = () => {
    if (!userDiscordId || userDiscordId !== trade?.discordid) {
      return (
        <div className="card-footer">
          Discord: {trade?.discordtag}
          <a
            className="float-right text-info"
            href={`https://discordapp.com/users/${trade?.discordid}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Send DM"
          >
            <i className="fab fa-discord" />
          </a>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => onDelete?.(trade?.idtrade)}
      >
        {t("Delete")}
      </button>
    );
  };

  const getQualityBadge = () => {
    const qualities = {
      0: { class: "light", text: "Common" },
      1: { class: "success", text: "Uncommon" },
      2: { class: "info", text: "Rare" },
      3: { class: "danger", text: "Epic" },
      4: { class: "warning", text: "Legendary" },
    };

    const quality = qualities[trade?.quality] || qualities["0"];
    return (
      <span className={`badge badge-${quality.class} mb-2`}>
        {t(quality.text)}
      </span>
    );
  };

  if (!trade) {
    return "";
  }

  return (
    <div className="col-xl-3 text-center">
      <div className="card mb-4 shadow-sm border-secondary">
        <div className="card-header">
          {trade.type === "Supply" ? (
            <i className="far fa-arrow-alt-circle-up" />
          ) : (
            <i className="far fa-arrow-alt-circle-down" />
          )}{" "}
          {t(trade.type)} {"//"} {trade.region}
        </div>
        <div className="card-body">
          {getQualityBadge()}
          <h5 className="card-title">
            {trade.amount !== "0" ? `${trade.amount}x ` : ""}{" "}
            <Icon key={trade.resource} name={trade.resource} />
            {t(trade.resource, { ns: "items" })}
          </h5>
          <p>
            {trade.price !== "0" ? `${trade.price} Flots/${t("Unit")}` : ""}
          </p>
          {trade.nickname ? `${t("Nick in Game")}: ${trade.nickname}` : ""}
        </div>
        {renderCardFooter()}
      </div>
    </div>
  );
};

export default Trade;
