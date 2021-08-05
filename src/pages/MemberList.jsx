import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import MemberListItem from "../components/MemberListItem";
import RequestMemberListItem from "../components/RequestMemberListItem";
import { getMembers } from "../services";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { getUserProfile, closeSession } from "../services";
import DiscordConfig from "../components/DiscordConfig";
import ClanConfig from "../components/ClanConfig";

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
      selectNewOwner: localStorage.getItem("discordid"),
      showRequestModal: false,
      requestData: null,
      isLeader: false,
      showBotConfig: false,
      clanid: null,
      showClanConfig: false,
    };
  }

  async componentDidMount() {
    const response = await getUserProfile();
    if (response.success) {
      this.setState({
        clanid: response.message.clanid,
        isLeader: response.message.discordid === response.message.leaderid,
      });
    } else {
      this.setState({ error: response.message, isLoaded: true });
    }

    this.updateMembers();

    Axios.get(
      process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanid +
        "/requests",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanid +
        "/members/" +
        memberdiscordid,
      params: {
        accion: "kick",
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("memberList");
        localStorage.removeItem("memberList-lastCheck");
        if (response.status === 202) {
          let members = this.state.members.filter(
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
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanid +
        "/requests/" +
        this.state.requestData.discordid,
      params: {
        accion: "accept",
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("memberList");
        localStorage.removeItem("memberList-lastCheck");
        if (response.status === 202) {
          let requestMembers = this.state.requestMembers.filter(
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
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanid +
        "/requests/" +
        this.state.requestData.discordid,
      params: {
        accion: "reject",
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("memberList");
        localStorage.removeItem("memberList-lastCheck");
        if (response.status === 202) {
          let requestMembers = this.state.requestMembers.filter(
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
      url: process.env.REACT_APP_API_URL + "/clans/" + this.state.clanid,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("profile");
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
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanid +
        "/members/" +
        this.state.selectNewOwner,
      params: {
        accion: "owner",
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        localStorage.removeItem("profile");
        localStorage.removeItem("memberList");
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
    } else if (this.state.clanid == null) {
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

    if (!this.state.isLoaded) {
      return <LoadingScreen />;
    }

    let showHideClassName = this.state.showRequestModal
      ? "modal d-block"
      : "modal d-none";
    return (
      <div className="row">
        <Helmet>
          <title>{t("Members List")} - Stiletto for Last Oasis</title>
          <meta
            name="description"
            content="This is the list of all the members of your clan"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Members List - Stiletto for Last Oasis"
          />
          <meta
            name="twitter:description"
            content="This is the list of all the members of your clan"
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg"
          />
          <link
            rel="canonical"
            href={
              window.location.protocol
                .concat("//")
                .concat(window.location.hostname) +
              (window.location.port ? ":" + window.location.port : "") +
              "/members"
            }
          />
        </Helmet>
        <div className={this.state.isLeader ? "col-12" : "col-12 d-none"}>
          <div className="row">
            <div className="col-12 col-lg-2 mr-auto mb-2">
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-primary" disabled>
                  <i className="fas fa-users-cog"></i>
                </button>
                <button
                  className={this.state.isLeader ? "btn btn-info" : "d-none"}
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
                  <i className="fab fa-discord"></i>
                </button>
                <button
                  className={this.state.isLeader ? "btn btn-info" : "d-none"}
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
                        this.state.members != null && this.state.isLeader
                          ? "text-center"
                          : "d-none"
                      }
                      scope="col"
                    >
                      {t("Kick")}
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
                        this.state.members != null && this.state.isLeader
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
                  className="btn btn-block btn-success"
                  onClick={() => this.acceptMember()}
                >
                  {t("Accept")}
                </button>
                <button
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
            onError={(error) => this.setState({ error: error })}
          />
        ) : (
          ""
        )}
        {this.state.showClanConfig ? (
          <ClanConfig
            key="clanconfig"
            clanid={this.state.clanid}
            onClose={() => this.setState({ showClanConfig: false })}
            onError={(error) => this.setState({ error: error })}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withTranslation()(MemberList);
