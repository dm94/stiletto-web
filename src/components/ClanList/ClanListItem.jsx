import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ClanName from "../ClanName";

class ClanListItem extends Component {
  sendRequestButton() {
    const { t } = this.props;
    if (this.props?.isLogged) {
      if (this.props?.clanuserid == null) {
        return (
          <button
            type="button"
            className="btn btn-block btn-primary"
            onClick={() => this.props?.onSendRequest(this.props?.clan.clanid)}
          >
            {t("Send request")}
          </button>
        );
      }
      if (this.props?.clanuserid === this.props?.clan.clanid) {
        return (
          <Link className="btn btn-block btn-primary" to="/members">
            {t("Members")}
          </Link>
        );
      }
    } else {
      return "";
    }
  }

  render() {
    return (
      <tr>
        <td className="pl-3">
          <ClanName key={this.props?.clan.name} clan={this.props?.clan} />
        </td>
        <td>{this.props?.clan.region}</td>
        <td>{this.props?.clan.discordTag}</td>
        <td>
          <a
            href={`https://discord.gg/${this.props?.clan.invitelink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.props?.clan.invitelink}
          </a>
        </td>
        <td>{this.sendRequestButton()}</td>
      </tr>
    );
  }
}

export default withTranslation()(ClanListItem);
