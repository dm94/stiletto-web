import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { getStyle } from "../BGDarkSyles";

class Trade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
    };
  }

  cardFooter(t) {
    if (
      this.state.user_discord_id == null ||
      this.state.user_discord_id != this.props.trade.discordid
    ) {
      return (
        <div className="card-footer">
          Discord: {this.props.trade.discordtag}
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

  render() {
    const { t } = this.props;
    return (
      <div className="col-xl-3 text-center">
        <div className={getStyle("card mb-4 shadow-sm border-secondary")}>
          <div className="card-header">
            {t(this.props.trade.type)} - {this.props.trade.region}
          </div>
          <div className="card-body">
            <h5 className="card-title">
              {this.props.trade.amount !== "0"
                ? this.props.trade.amount + "x "
                : ""}{" "}
              {t(this.props.trade.resource)}{" "}
              {this.props.trade.quality !== "0"
                ? "Q: " + this.props.trade.quality
                : ""}
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
