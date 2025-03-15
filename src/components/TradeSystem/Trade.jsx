import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import { getStoredItem } from "../../functions/services";

const Trade = ({ trade, onDelete }) => {
  const { t } = useTranslation();
  const userDiscordId = getStoredItem("discordid");

  const renderCardFooter = () => {
    if (!userDiscordId || userDiscordId !== trade?.discordid) {
      return (
        <div className="p-4 bg-gray-900 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Discord: {trade?.discordtag}</span>
            <a
              className="text-blue-400 hover:text-blue-300"
              href={`https://discordapp.com/users/${trade?.discordid}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Send DM"
            >
              <i className="fab fa-discord" />
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <button
          type="button"
          className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => onDelete?.(trade?.idtrade)}
        >
          {t("Delete")}
        </button>
      </div>
    );
  };

  const getQualityBadge = () => {
    const qualities = {
      0: { class: "bg-gray-500", text: "Common" },
      1: { class: "bg-green-500", text: "Uncommon" },
      2: { class: "bg-blue-500", text: "Rare" },
      3: { class: "bg-red-500", text: "Epic" },
      4: { class: "bg-yellow-500", text: "Legendary" },
    };

    const quality = qualities[trade?.quality] || qualities["0"];
    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-white text-sm ${quality.class} mb-2`}
      >
        {t(quality.text)}
      </span>
    );
  };

  if (!trade) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
        <div className="p-3 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center justify-center space-x-2">
            {trade.type === "Supply" ? (
              <i className="far fa-arrow-alt-circle-up text-green-400" />
            ) : (
              <i className="far fa-arrow-alt-circle-down text-red-400" />
            )}
            <span className="text-gray-300">
              {t(trade.type)} {"//"} {trade.region}
            </span>
          </div>
        </div>
        <div className="p-4 text-center">
          {getQualityBadge()}
          <div className="text-lg font-medium text-gray-300 mb-2 flex justify-center">
            {trade.amount !== "0" ? `${trade.amount}x ` : ""}{" "}
            <Icon key={trade.resource} name={trade.resource} />
            <h5>{t(trade.resource, { ns: "items" })}</h5>
          </div>
          <p className="text-gray-400 mb-2">
            {trade.price !== "0" ? `${trade.price} Flots/${t("Unit")}` : ""}
          </p>
          {trade.nickname && (
            <p className="text-gray-400">{`${t("Nick in Game")}: ${trade.nickname}`}</p>
          )}
        </div>
        {renderCardFooter()}
      </div>
    </div>
  );
};

export default Trade;
