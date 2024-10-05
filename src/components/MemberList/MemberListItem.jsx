import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { getStoredItem } from "../../services";

class MemberListItem extends Component {
  kickButton() {
    const { t } = this.props;
    if (this.props?.isLeader || this.props?.hasPermissions) {
      if (
        this.props?.member.discordid !== getStoredItem("discordid") &&
        this.props?.member.discordid !== this.props?.member.leaderid
      ) {
        return (
          <td>
            <button
              className="btn btn-block btn-danger"
              onClick={() => this.props?.onKick(this.props?.member.discordid)}
            >
              {t("Kick")}
            </button>
          </td>
        );
      }
    }
  }

  editPermissionsButton() {
    const { t } = this.props;
    if (this.props?.isLeader) {
      if (
        this.props?.member.discordid !== getStoredItem("discordid") &&
        this.props?.member.discordid !== this.props?.member.leaderid
      ) {
        return (
          <td className="text-center">
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-primary" disabled>
                <i className="fas fa-user-cog" />
              </button>
              <button
                className="btn btn-block btn-info"
                onClick={() =>
                  this.props?.onClickEditPermissions(
                    this.props?.member.discordid,
                  )
                }
              >
                {t("Edit")}
              </button>
            </div>
          </td>
        );
      }
    }
  }

  render() {
    return (
      <tr>
        <td className="text-center">
          {this.props?.member.leaderid === this.props?.member.discordid && (
            <i className="fas fa-crown text-warning" />
          )}{" "}
          {this.props?.member.discordtag}
        </td>
        <td className="text-center">{this.props?.member.nickname}</td>
        {this.kickButton()}
        {this.editPermissionsButton()}
      </tr>
    );
  }
}

export default withTranslation()(MemberListItem);
