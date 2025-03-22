import type React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import { getStoredItem } from "../../functions/services";
import type { TradeInfo } from "../../types/dto/trades";

interface TradeProps {
  trade: TradeInfo;
  onDelete?: (idTrade: number) => void;
}

interface QualityOption {
  class: string;
  text: string;
}

const Trade: React.FC<TradeProps> = ({ trade, onDelete }) => {
  const { t } = useTranslation();
  const userDiscordId = getStoredItem("discordid");

  const renderCardFooter = (): React.ReactElement => {
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
              data-cy="discord-link"
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
          data-cy="delete-trade-btn"
        >
          {t("common.delete")}
        </button>
      </div>
    );
  };

  const getQualityBadge = (): React.ReactElement => {
    const qualities: Record<number, QualityOption> = {
      0: { class: "bg-gray-500", text: "crafting.common" },
      1: { class: "bg-green-500", text: "crafting.uncommon" },
      2: { class: "bg-blue-500", text: "crafting.rare" },
      3: { class: "bg-red-500", text: "crafting.epic" },
      4: { class: "bg-yellow-500", text: "crafting.legendary" },
    };

    const quality = qualities[trade?.quality ?? 0];
    return (
      <span
        className={`inline-block px-2 py-1 rounded-full text-white text-sm ${quality.class} mb-2`}
        data-cy="trade-quality"
      >
        {t(quality.text)}
      </span>
    );
  };

  if (!trade) {
    return null;
  }

  return (
    <div className="w-full" data-cy="trade-item">
      <div
        className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg"
        data-cy="trade-card"
      >
        <div
          className="p-3 bg-gray-900 border-b border-gray-700"
          data-cy="trade-header"
        >
          <div className="flex items-center justify-center space-x-2">
            {trade.type === "Supply" ? (
              <i className="far fa-arrow-alt-circle-up text-green-400" />
            ) : (
              <i className="far fa-arrow-alt-circle-down text-red-400" />
            )}
            <span className="text-gray-300" data-cy="trade-type-region">
              {t(trade.type)} {"//"} {trade.region}
            </span>
          </div>
        </div>
        <div className="p-4 text-center" data-cy="trade-content">
          {getQualityBadge()}
          <div
            className="text-lg font-medium text-gray-300 mb-2 flex justify-center"
            data-cy="trade-resource"
          >
            {trade?.amount !== 0 ? `${trade.amount}x ` : ""}{" "}
            <Icon key={trade.resource} name={trade.resource} />
            <h5>{t(trade.resource, { ns: "items" })}</h5>
          </div>
          <p className="text-gray-400 mb-2" data-cy="trade-price">
            {trade?.price !== 0
              ? `${trade.price} Flots/${t("trades.unit")}`
              : ""}
          </p>
          {trade.nickname && (
            <p
              className="text-gray-400"
              data-cy="trade-nickname"
            >{`${t("profile.nickInGame")}: ${trade.nickname}`}</p>
          )}
        </div>
        {renderCardFooter()}
      </div>
    </div>
  );
};

export default Trade;
