import React, { Component } from "react";

class ClanListItem extends Component {
  state = {};
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
        <td>
          <button className="btn btn-block btn-primary" type="submit">
            Send request
          </button>
        </td>
      </tr>
    );
  }
}

export default ClanListItem;
