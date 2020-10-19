import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

class ClanListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clanuserid: localStorage.getItem("clanid"),
    };
  }

  sendRequestButton() {
    if (this.state.clanuserid == "null") {
      return (
        <button
          className="btn btn-block btn-primary"
          onClick={(e) => this.props.onSendRequest(this.props.clan.clanid)}
        >
          Send request
        </button>
      );
    } else if (this.state.clanuserid == this.props.clan.clanid) {
      return (
        <Link className="btn btn-block btn-primary" to="/members">
          Clan Members
        </Link>
      );
    }
  }

  render() {
    return (
      <tr>
        <td className="text-center">{this.props.clan.name}</td>
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

export default ClanListItem;
