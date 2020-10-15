import React, { Component } from "react";

class RequestMemberListItem extends Component {
  state = {};

  acceptButton() {
    if (this.props.member.leaderid == localStorage.getItem("discordid")) {
      return (
        <button
          className="btn btn-block btn-success"
          onClick={(e) => this.props.onAccept(this.props.member.discordid)}
        >
          Accept
        </button>
      );
    }
  }

  rejectButton() {
    if (this.props.member.leaderid == localStorage.getItem("discordid")) {
      return (
        <button
          className="btn btn-block btn-danger"
          onClick={(e) => this.props.onReject(this.props.member.discordid)}
        >
          Reject
        </button>
      );
    }
  }

  render() {
    return (
      <tr>
        <td className="text-center">{this.props.member.discordtag}</td>
        <td className="text-center">{this.props.member.nickname}</td>
        <td>{this.acceptButton()}</td>
        <td>{this.rejectButton()}</td>
      </tr>
    );
  }
}

export default RequestMemberListItem;
