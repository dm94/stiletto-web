import React, { Component } from "react";

class MemberListItem extends Component {
  state = {};

  kickButton() {
    if (this.props.member.leaderid == localStorage.getItem("discordid")) {
      if (this.props.member.discordid != localStorage.getItem("discordid")) {
        return (
          <button
            className="btn btn-block btn-danger"
            onClick={(e) => this.props.onKick(this.props.member.discordid)}
          >
            Kick
          </button>
        );
      }
    }
  }

  render() {
    return (
      <tr>
        <td className="text-center">{this.props.member.discordtag}</td>
        <td className="text-center">{this.props.member.nickname}</td>
        <td>{this.kickButton()}</td>
      </tr>
    );
  }
}

export default MemberListItem;
