import React, { Component } from "react";
import { Link } from "react-router-dom";
import ClanName from "./ClanName";
import { withTranslation } from "react-i18next";

class ClanListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clanuserid: localStorage.getItem("clanid"),
    };
  }

  sendRequestButton() {
    const { t } = this.props;
    if (this.state.clanuserid == "null") {
      return (
        <button
          className="btn btn-block btn-primary"
          onClick={(e) => this.props.onSendRequest(this.props.clan.clanid)}
        >
          {t("Send request")}
        </button>
      );
    } else if (this.state.clanuserid == this.props.clan.clanid) {
      return (
        <Link className="btn btn-block btn-primary" to="/members">
          {t("Members")}
        </Link>
      );
    }
  }

  render() {
    return (
      <tr>
        <td className="text-center">
          <ClanName key={this.props.clan.name} clan={this.props.clan} />
        </td>
        <td className="text-center">{this.props.clan.discordTag}</td>
        <td className="text-center">
          <a
            href={"https://discord.gg/" + this.props.clan.invitelink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.props.clan.invitelink}
          </a>
        </td>
        <td>{this.sendRequestButton()}</td>
      </tr>
    );
  }
}

export default withTranslation()(ClanListItem);
