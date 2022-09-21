import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Icon from "../Icon";
import { getStoredItem } from "../../services";

class Trade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: getStoredItem("discordid"),
    };
  }

  cardFooter(t) {
    if (
      this.state.user_discord_id == null ||
      this.state.user_discord_id !== this.props.trade.discordid
    ) {
      return (
        <div className="card-footer">
          Discord: {this.props.trade.discordtag}
          <a
            className="float-right text-info"
            href={"https://discordapp.com/users/" + this.props.trade.discordid}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Send DM"
          >
            <i className="fab fa-discord"></i>
          </a>
        </div>
      );
    } else {
      return (
        <button
          className="btn btn-danger"
          onClick={(e) => this.props.onDelete(this.props.trade.idtrade)}
        >
          {t("Delete")}
        </button>
      );
    }
  }

  showQuality(t) {
    switch (this.props.trade.quality) {
      case "0":
        return <span className="badge badge-light mb-2">{t("Common")}</span>;
      case "1":
        return (
          <span className="badge badge-success mb-2">{t("Uncommon")}</span>
        );
      case "2":
        return <span className="badge badge-info mb-2">{t("Rare")}</span>;
      case "3":
        return <span className="badge badge-danger mb-2">{t("Epic")}</span>;
      case "4":
        return (
          <span className="badge badge-warning mb-2">{t("Legendary")}</span>
        );
      default:
        return <span className="badge badge-light mb-2">{t("Common")}</span>;
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div className="col-xl-3 text-center">
        <div className="card mb-4 shadow-sm border-secondary">
          <div className="card-header">
            {this.props.trade.type === "Supply" ? (
              <i className="far fa-arrow-alt-circle-up"></i>
            ) : (
              <i className="far fa-arrow-alt-circle-down"></i>
            )}{" "}
            {t(this.props.trade.type)} {"//"} {this.props.trade.region}
          </div>
          <div className="card-body">
            {this.showQuality(t)}
            <h5 className="card-title">
              {this.props.trade.amount !== "0"
                ? this.props.trade.amount + "x "
                : ""}{" "}
              <Icon
                key={this.props.trade.resource}
                name={this.props.trade.resource}
              />
              {t(this.props.trade.resource)}
            </h5>
            <p>
              {this.props.trade.price !== "0"
                ? this.props.trade.price + " Flots/" + t("Unit")
                : ""}
            </p>
            {this.props.trade.nickname != null
              ? t("Nick in game") + ": " + this.props.trade.nickname
              : ""}
          </div>
          {this.cardFooter(t)}
        </div>
      </div>
    );
  }
}

export default withTranslation()(Trade);
