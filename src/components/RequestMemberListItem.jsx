import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class RequestMemberListItem extends Component {
  acceptButton(t) {
    if (this.props.member.leaderid == localStorage.getItem("discordid")) {
      return (
        <button
          className="btn btn-block btn-success"
          onClick={(e) => this.props.onAccept(this.props.member.discordid)}
        >
          {t("Accept")}
        </button>
      );
    }
  }

  rejectButton(t) {
    if (this.props.member.leaderid == localStorage.getItem("discordid")) {
      return (
        <button
          className="btn btn-block btn-danger"
          onClick={(e) => this.props.onReject(this.props.member.discordid)}
        >
          {t("Reject")}
        </button>
      );
    }
  }

  render() {
    const { t } = this.props;
    return (
      <tr>
        <td className="text-center">{this.props.member.discordtag}</td>
        <td className="text-center">{this.props.member.nickname}</td>
        <td>{this.acceptButton(t)}</td>
        <td>{this.rejectButton(t)}</td>
      </tr>
    );
  }
}

export default withTranslation()(RequestMemberListItem);
