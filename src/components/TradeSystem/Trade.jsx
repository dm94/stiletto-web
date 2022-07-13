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
            <h5 className="card-title">
              {this.props.trade.amount !== "0"
                ? this.props.trade.amount + "x "
                : ""}{" "}
              <Icon
                key={this.props.trade.resource}
                name={this.props.trade.resource}
              />
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
