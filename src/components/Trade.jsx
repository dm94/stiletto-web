import React, { Component } from "react";

class Trade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
    };
  }

  cardFooter() {
    if (
      this.state.user_discord_id == null ||
      this.state.user_discord_id != this.props.trade.discordid
    ) {
      return (
        <div class="card-footer">Discord: {this.props.trade.discordtag}</div>
      );
    } else {
      return (
        <button
          className="btn btn-danger"
          onClick={(e) => this.props.onDelete(this.props.trade.idtrade)}
        >
          Delete
        </button>
      );
    }
  }

  render() {
    return (
      <div className="col-xl-3 text-center">
        <div className="card mb-4 shadow-sm">
          <div className="card-header">
            {this.props.trade.type} - {this.props.trade.region}
          </div>
          <div className="card-body">
            <h5 class="card-title">
              {this.props.trade.amount !== 0
                ? this.props.trade.amount + "x "
                : ""}{" "}
              {this.props.trade.resource}{" "}
              {this.props.trade.quality !== 0
                ? "Q: " + this.props.trade.quality
                : ""}
            </h5>
            {this.props.trade.nickname != null
              ? "Nick in game: " + this.props.trade.nickname
              : ""}
          </div>
          {this.cardFooter()}
        </div>
      </div>
    );
  }
}

export default Trade;
