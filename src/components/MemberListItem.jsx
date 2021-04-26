import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class MemberListItem extends Component {
  kickButton() {
    const { t } = this.props;
    if (this.props.member.leaderid == localStorage.getItem("discordid")) {
      if (this.props.member.discordid != localStorage.getItem("discordid")) {
        return (
          <button
            className="btn btn-block btn-danger"
            onClick={(e) => this.props.onKick(this.props.member.discordid)}
          >
            {t("Kick")}
          </button>
        );
      }
    }
  }

  render() {
    return (
      <tr>
        <td className="text-center">
          {this.props.member.leaderid == this.props.member.discordid && (
            <i className="fas fa-crown text-warning"></i>
          )}{" "}
          {this.props.member.discordtag}
        </td>
        <td className="text-center">{this.props.member.nickname}</td>
        <td>{this.kickButton()}</td>
      </tr>
    );
  }
}

export default withTranslation()(MemberListItem);
