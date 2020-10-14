import React, { Component } from "react";

class ClanListItem extends Component {
  state = {};
  render() {
    return (
      <tr>
        <td class="text-center">{this.props.clan.name}</td>
        <td class="text-center">{this.props.clan.discordTag}</td>
        <td class="text-center">
          <a
            href={"https://discord.gg/" + this.props.clan.invitelink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.props.clan.invitelink}
          </a>
        </td>
        <td>
          <button class="btn btn-block btn-primary" type="submit">
            Send request
          </button>
        </td>
      </tr>
    );
  }
}

export default ClanListItem;
