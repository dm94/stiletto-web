import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class RequestMemberListItem extends Component {
  showButton(t) {
    if (this.props.member.leaderid == localStorage.getItem("discordid")) {
      return (
        <button
          className="btn btn-block btn-primary"
          onClick={() => this.props.onShowRequest(this.props.member)}
        >
          {t("Show request")}
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
        <td>{this.showButton(t)}</td>
      </tr>
    );
  }
}

export default withTranslation()(RequestMemberListItem);
