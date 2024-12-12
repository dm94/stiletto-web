import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";

import {
  getUserProfile,
  closeSession,
  getHasPermissions,
  getMembers,
  getStoredItem,
} from "../services";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import ClanConfig from "../components/ClanConfig";
import MemberListItem from "../components/MemberList/MemberListItem";
import RequestMemberListItem from "../components/MemberList/RequestMemberListItem";
import DiscordConfig from "../components/MemberList/DiscordConfig";
import MemberPermissionsConfig from "../components/MemberList/MemberPermissionsConfig";
import { sendNotification } from "../functions/broadcast";
import { getDomain } from "../functions/utils";
import { config } from "../config/config";

class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      members: null,
      requestMembers: null,
      error: null,
      isLoadedRequestList: false,
      redirectMessage: null,
      selectNewOwner: getStoredItem("discordid"),
      showRequestModal: false,
      requestData: null,
      isLeader: false,
      showBotConfig: false,
      clanid: null,
      showClanConfig: false,
      hasBotPermissions: false,
      hasRequestPermissions: false,
      hasKickMembersPermisssions: false,
      memberForEdit: null,
    };
  }

  async componentDidMount() {
    const userProfile = await getUserProfile();
    if (userProfile.success) {
      this.setState({
        clanid: userProfile.message.clanid,
        isLeader:
          userProfile.message.discordid === userProfile.message.leaderid,
      });
    } else {
      this.setState({ error: userProfile.message, isLoaded: true });
      return;
    }

    this.updateMembers();

    Axios.get(
      `${config.REACT_APP_API_URL}/clans/${this.state.clanid}/requests`,
      {
        headers: {
          Authorization: `Bearer ${getStoredItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 202) {
          this.setState({ requestMembers: response.data });
        } else if (response.status === 405 || response.status === 401) {
          closeSession();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
        this.setState({ isLoadedRequestList: true });
      })
      .catch(() => {
        this.setState({
          error: "Error when connecting to the API",
        });
      });

    const hasBotPermissions = await getHasPermissions("bot");
    const hasRequestPermissions = await getHasPermissions("request");
    const hasKickMembersPermisssions = await getHasPermissions("kickmembers");
    this.setState({
      hasBotPermissions: hasBotPermissions,
      hasRequestPermissions: hasRequestPermissions,
      hasKickMembersPermisssions: hasKickMembersPermisssions,
    });
  }

  async updateMembers() {
    const response = await getMembers();
    if (response.success) {
      this.setState({ members: response.message, isLoaded: true });
    } else {
      this.setState({ error: response.message, isLoaded: true });
    }
  }

  kickMember = (memberdiscordid) => {
    const options = {
      method: "put",
      url: `${config.REACT_APP_API_URL}/clans/${this.state.clanid}/members/${memberdiscordid}`,
      params: {
        accion: "kick",
      },
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList");
        localStorage.removeItem("memberList-lastCheck");
        sessionStorage.removeItem("memberList-lastCheck");
        if (response.status === 202) {
          const members = this.state.members.filter(
            (m) => m.discordid !== memberdiscordid
          );
          this.setState({ members: members });
        } else if (response.status === 405 || response.status === 401) {
          closeSession();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  acceptMember = () => {
    this.setState({ showRequestModal: false });
    if (this.state.requestData == null) {
      return;
    }

    const options = {
      method: "put",
      url: `${config.REACT_APP_API_URL}/clans/${this.state.clanid}/requests/${this.state.requestData.discordid}`,
      params: {
        accion: "accept",
      },
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList-lastCheck");
        localStorage.removeItem("memberList-lastCheck");
        if (response.status === 202) {
          const requestMembers = this.state.requestMembers.filter(
            (m) => m.discordid !== this.state.requestData.discordid
          );
          this.setState({ requestMembers: requestMembers });
          this.componentDidMount();
        } else if (response.status === 405 || response.status === 401) {
          closeSession();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
        this.setState({ requestData: null });
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  rejectMember = () => {
    this.setState({ showRequestModal: false });
    if (this.state.requestData == null) {
      return;
    }
    const options = {
      method: "put",
      url: `${config.REACT_APP_API_URL}/clans/${this.state.clanid}/requests/${this.state.requestData.discordid}`,
      params: {
        accion: "reject",
      },
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList-lastCheck");
        localStorage.removeItem("memberList-lastCheck");
        if (response.status === 202) {
          const requestMembers = this.state.requestMembers.filter(
            (m) => m.discordid !== this.state.requestData.discordid
          );
          this.setState({ requestMembers: requestMembers });
          this.componentDidMount();
        } else if (response.status === 405 || response.status === 401) {
          closeSession();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
        this.setState({ requestData: null });
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  deleteClan = () => {
    const options = {
      method: "delete",
      url: `${config.REACT_APP_API_URL}/clans/${this.state.clanid}`,
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("profile");
        sessionStorage.removeItem("profile");
        sessionStorage.removeItem("memberList-lastCheck");
        sessionStorage.removeItem("memberList");
        localStorage.removeItem("memberList");
        localStorage.removeItem("memberList-lastCheck");
        if (response.status === 204) {
          this.setState({ redirectMessage: "Clan deleted correctly" });
        } else if (response.status === 405) {
          closeSession();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  changeOwner = () => {
    const options = {
      method: "put",
      url: `${config.REACT_APP_API_URL}/clans/${this.state.clanid}/members/${this.state.selectNewOwner}`,
      params: {
        accion: "owner",
      },
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("profile");
        sessionStorage.removeItem("profile");
        localStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList");
        sessionStorage.removeItem("memberList-lastCheck");
        localStorage.removeItem("memberList-lastCheck");
        if (response.status === 202) {
          this.setState({ redirectMessage: "Clan updated correctly" });
        } else if (response.status === 405 || response.status === 401) {
          closeSession();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  list() {
    if (this.state.members != null) {
      return this.state.members.map((member) => (
        <MemberListItem
          key={member.discordid}
          member={member}
          onKick={this.kickMember}
          onClickEditPermissions={(discordid) =>
            this.setState({ memberForEdit: discordid })
          }
          isLeader={this.state.isLeader}
          hasPermissions={this.state.hasKickMembersPermisssions}
        />
      ));
    }
  }

  requestList(t) {
    if (this.state.isLoadedRequestList) {
      if (
        this.state.requestMembers != null &&
        this.state.requestMembers.length > 0
      ) {
        return this.state.requestMembers.map((member) => (
          <RequestMemberListItem
            key={member.discordid}
            member={member}
            isLeader={this.state.isLeader || this.state.hasRequestPermissions}
            onShowRequest={(r) =>
              this.setState({ requestData: r, showRequestModal: true })
            }
          />
        ));
      } else {
        return (
          <tr>
            <td colSpan="4" className="text-center">
              {t("There are no pending requests")}
            </td>
          </tr>
        );
      }
    } else {
      return (
        <tr>
          <td colSpan="4" className="text-center">
            {t("Loading the list of requests to enter the clan")}
          </td>
        </tr>
      );
    }
  }

  deleteClanButton(t) {
    if (this.state.members != null && this.state.isLeader) {
      return (
        <div className="col-xl-3">
          <div className="card mb-3">
            <div className="card-header">{t("Delete Clan")}</div>
            <div className="card-body">
              {t(
                "By deleting the clan you will delete all the data linked to it, be careful because this option is not reversible"
              )}
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="btn btn-block btn-danger"
                onClick={() => this.deleteClan()}
              >
                {t("Delete")}
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  transferOwnerPanel(t) {
    if (this.state.members != null && this.state.isLeader) {
      return (
        <div className="col-xl-3">
          <div className="card mb-3">
            <div className="card-header">{t("Transfer Clan")}</div>
            <div className="card-body">
              <p>
                {t(
                  "This option is not reversible, so be careful who you pass it on to in the leadership of the clan"
                )}
              </p>
              <label htmlFor="selectNewOwner">{t("New leader:")}</label>
              <select
                id="selectNewOwner"
                className="custom-select"
                value={this.state.selectNewOwner}
                onChange={(evt) =>
                  this.setState({
                    selectNewOwner: evt.target.value,
                  })
                }
              >
                {this.memberListOption()}
              </select>
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="btn btn-block btn-danger"
                onClick={() => this.changeOwner()}
              >
                {t("Change leader")}
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  memberListOption() {
    if (this.state.members != null) {
      return this.state.members.map((member) => (
        <option key={member.discordid} value={member.discordid}>
          {member.discordtag}
        </option>
      ));
    }
  }

  render() {
    const { t } = this.props;
    if (this.state.error) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: this.state.error,
            redirectPage: "/profile",
          }}
        />
      );
    } else if (this.state.redirectMessage) {
      return (
        <ModalMessage
          message={{
            isError: false,
            text: this.state.redirectMessage,
            redirectPage: "/profile",
          }}
        />
      );
    }

    if (!this.state.isLoaded) {
      return <LoadingScreen />;
    }

    if (this.state.clanid == null) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: "You do not have permission to access this page",
            redirectPage: "/profile",
          }}
        />
      );
    }

    const showHideClassName = this.state.showRequestModal
      ? "modal d-block"
      : "modal d-none";
    return (
      <div className="row">
        <Helmet>
          <title>Clan Member List - Stiletto for Last Oasis</title>
          <meta
            name="description"
            content="This is the list of all the members of your clan"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Clan Member List - Stiletto for Last Oasis"
          />
          <meta
            name="twitter:description"
            content="This is the list of all the members of your clan"
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg"
          />
          <link rel="canonical" href={`${getDomain()}/members`} />
        </Helmet>
        <div
          className={
            this.state.isLeader || this.state.hasBotPermissions
              ? "col-12"
              : "col-12 d-none"
          }
        >
          <div className="row">
            <div
              className={
                this.state.isLeader ? "col-12 col-lg-2 mr-auto mb-2" : "d-none"
              }
            >
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-primary" disabled>
                  <i className="fas fa-users-cog" />
                </button>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => {
                    this.setState({ showClanConfig: true });
                  }}
                >
                  {t("Clan Configuration")}
                </button>
              </div>
            </div>
            <div className="col-12 col-lg-2 ml-auto mb-2">
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-primary" disabled>
                  <i className="fab fa-discord" />
                </button>
                <button
                  type="button"
                  className={
                    this.state.isLeader || this.state.hasBotPermissions
                      ? "btn btn-info"
                      : "d-none"
                  }
                  onClick={() => {
                    this.setState({ showBotConfig: true });
                  }}
                >
                  {t("Discord Bot Configuration")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card mb-3">
            <div className="card-header">{t("Member List")}</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center" scope="col">
                      {t("Discord Tag")}
                    </th>
                    <th className="text-center" scope="col">
                      {t("Nick in Game")}
                    </th>
                    <th
                      className={
                        this.state.members != null &&
                        (this.state.isLeader ||
                          this.state.hasKickMembersPermisssions)
                          ? "text-center"
                          : "d-none"
                      }
                      scope="col"
                    >
                      {t("Kick")}
                    </th>
                    <th
                      className={
                        this.state.members != null && this.state.isLeader
                          ? "text-center"
                          : "d-none"
                      }
                      scope="col"
                    >
                      {t("Edit")}
                    </th>
                  </tr>
                </thead>
                <tbody>{this.list()}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card mb-3">
            <div className="card-header">{t("List of requests")}</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center" scope="col">
                      {t("Discord Tag")}
                    </th>
                    <th className="text-center" scope="col">
                      {t("Nick in Game")}
                    </th>
                    <th
                      className={
                        this.state.members != null &&
                        (this.state.isLeader ||
                          this.state.hasRequestPermissions)
                          ? "text-center"
                          : "d-none"
                      }
                      scope="col"
                    >
                      {t("Show request")}
                    </th>
                  </tr>
                </thead>
                <tbody>{this.requestList(t)}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={showHideClassName}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="sendRequest">
                  {t("Request")}
                </h5>
              </div>
              <div className="modal-body">
                {this.state.requestData != null
                  ? this.state.requestData.message
                  : ""}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-block btn-success"
                  onClick={() => this.acceptMember()}
                >
                  {t("Accept")}
                </button>
                <button
                  type="button"
                  className="btn btn-block btn-danger"
                  onClick={() => this.rejectMember()}
                >
                  {t("Reject")}
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.transferOwnerPanel(t)}
        {this.deleteClanButton(t)}
        {this.state.showBotConfig ? (
          <DiscordConfig
            key="discordbotconfig"
            clanid={this.state.clanid}
            onClose={() => this.setState({ showBotConfig: false })}
            onError={(error) => sendNotification(error, "Error")}
          />
        ) : (
          ""
        )}
        {this.state.showClanConfig ? (
          <ClanConfig
            key="clanconfig"
            clanid={this.state.clanid}
            onClose={() => this.setState({ showClanConfig: false })}
            onError={(error) => sendNotification(error, "Error")}
          />
        ) : (
          ""
        )}
        {this.state.memberForEdit ? (
          <MemberPermissionsConfig
            key="discordbotconfig"
            clanid={this.state.clanid}
            memberid={this.state.memberForEdit}
            onClose={() => this.setState({ memberForEdit: null })}
            onError={(error) => sendNotification(error, "Error")}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withTranslation()(MemberList);
