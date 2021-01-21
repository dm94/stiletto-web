import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import MemberListItem from "../components/MemberListItem";
import RequestMemberListItem from "../components/RequestMemberListItem";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { getStyle } from "../components/BGDarkSyles";

class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      clanid: localStorage.getItem("clanid"),
      isLoaded: false,
      members: null,
      requestMembers: null,
      error: null,
      isLoadedRequestList: false,
      redirectMessage: null,
      selectNewOwner: localStorage.getItem("discordid"),
    };
  }

  componentDidMount() {
    Axios.get(process.env.REACT_APP_API_URL + "/clans.php", {
      params: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
        accion: "seeclanmembers",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ members: response.data });
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
        this.setState({ isLoaded: true });
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });

    Axios.get(process.env.REACT_APP_API_URL + "/clans.php", {
      params: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
        accion: "seeclanrequests",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ requestMembers: response.data });
        }
        this.setState({ isLoadedRequestList: true });
      })
      .catch((error) => {
        this.setState({
          error: "Error when connecting to the API",
        });
      });
  }

  kickMember = (memberdiscordid) => {
    Axios.get(process.env.REACT_APP_API_URL + "/clans.php", {
      params: {
        discordid: localStorage.getItem("discordid"),
        token: localStorage.getItem("token"),
        dataupdate: memberdiscordid,
        accion: "kickfromclan",
      },
    })
      .then((response) => {
        if (response.status === 202) {
          let members = this.state.members.filter(
            (m) => m.discordid !== memberdiscordid
          );
          this.setState({ members: members });
        } else {
          this.setState({ error: "Error when kicking a member" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  acceptMember = (memberdiscordid) => {
    Axios.get(process.env.REACT_APP_API_URL + "/clans.php", {
      params: {
        discordid: localStorage.getItem("discordid"),
        token: localStorage.getItem("token"),
        dataupdate: memberdiscordid,
        accion: "acceptmember",
      },
    })
      .then((response) => {
        if (response.status === 202) {
          let requestMembers = this.state.requestMembers.filter(
            (m) => m.discordid !== memberdiscordid
          );
          this.setState({ requestMembers: requestMembers });
          this.componentDidMount();
        } else {
          this.setState({ error: "Error when add member" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  rejectMember = (memberdiscordid) => {
    Axios.get(process.env.REACT_APP_API_URL + "/clans.php", {
      params: {
        discordid: localStorage.getItem("discordid"),
        token: localStorage.getItem("token"),
        dataupdate: memberdiscordid,
        accion: "rejectmember",
      },
    })
      .then((response) => {
        if (response.status === 202) {
          let requestMembers = this.state.requestMembers.filter(
            (m) => m.discordid !== memberdiscordid
          );
          this.setState({ requestMembers: requestMembers });
        } else {
          this.setState({ error: "Error when reject member" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  deleteClan = () => {
    Axios.get(process.env.REACT_APP_API_URL + "/clans.php", {
      params: {
        discordid: localStorage.getItem("discordid"),
        token: localStorage.getItem("token"),
        accion: "deleteclan",
      },
    })
      .then((response) => {
        if (response.status === 202) {
          localStorage.setItem("clanid", "null");
          this.setState({ redirectMessage: "Clan deleted correctly" });
        } else {
          this.setState({ error: "Error when delete clan" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  changeOwner = () => {
    Axios.get(process.env.REACT_APP_API_URL + "/clans.php", {
      params: {
        discordid: localStorage.getItem("discordid"),
        token: localStorage.getItem("token"),
        dataupdate: this.state.selectNewOwner,
        accion: "changeowner",
      },
    })
      .then((response) => {
        if (response.status === 202) {
          this.setState({ redirectMessage: "Clan updated correctly" });
        } else {
          this.setState({ error: "Error when change owner of clan" });
        }
      })
      .catch((error) => {
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
            onAccept={this.acceptMember}
            onReject={this.rejectMember}
          />
        ));
      } else {
        return (
          <tr>
            <td colSpan="4">{t("There are no pending requests")}</td>
          </tr>
        );
      }
    } else {
      return (
        <tr>
          <td colSpan="4">
            {t("Loading the list of requests to enter the clan")}
          </td>
        </tr>
      );
    }
  }

  deleteClanButton(t) {
    if (
      this.state.members != null &&
      this.state.members[0].leaderid == localStorage.getItem("discordid")
    ) {
      return (
        <div className="col-xl-3">
          <div className={getStyle("card mb-3")}>
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
    if (
      this.state.members != null &&
      this.state.members[0].leaderid == localStorage.getItem("discordid")
    ) {
      return (
        <div className="col-xl-3">
          <div className={getStyle("card mb-3")}>
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
            text: t(this.state.error),
            redirectPage: "/profile",
          }}
        />
      );
    } else if (this.state.redirectMessage) {
      return (
        <ModalMessage
          message={{
            isError: false,
            text: t(this.state.redirectMessage),
            redirectPage: "/profile",
          }}
        />
      );
    } else if (
      this.state.clanid == "null" ||
      this.state.user_discord_id == null ||
      this.state.token == null
    ) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: t("You do not have permission to access this page"),
            redirectPage: "/profile",
          }}
        />
      );
    }

    if (!this.state.isLoaded) {
      return <LoadingScreen />;
    }

    return (
      <div className="row">
        <Helmet>
          <title>Members List - Stiletto</title>
          <meta
            name="description"
            content="This is the list of all the members of your clan"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@dm94dani" />
          <meta name="twitter:title" content="Members List - Stiletto" />
          <meta
            name="twitter:description"
            content="This is the list of all the members of your clan"
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg"
          />
        </Helmet>
        <div className="col-xl-6">
          <div className={getStyle("card mb-3")}>
            <div className="card-header">{t("Member List")}</div>
            <div className="card-body">
              <table className={getStyle("table")}>
                <thead>
                  <tr>
                    <th className="text-center" scope="col">
                      {t("Discord Tag")}
                    </th>
                    <th className="text-center" scope="col">
                      {t("Nick in game")}
                    </th>
                    <th className="text-center" scope="col">
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
          <div className={getStyle("card mb-3")}>
            <div className="card-header">{t("List of requests")}</div>
            <div className="card-body">
              <table className={getStyle("table")}>
                <thead>
                  <tr>
                    <th className="text-center" scope="col">
                      {t("Discord Tag")}
                    </th>
                    <th className="text-center" scope="col">
                      {t("Nick in game")}
                    </th>
                    <th className="text-center" scope="col">
                      {t("Accept")}
                    </th>
                    <th className="text-center" scope="col">
                      {t("Reject")}
                    </th>
                  </tr>
                </thead>
                <tbody>{this.requestList(t)}</tbody>
              </table>
            </div>
          </div>
        </div>
        {this.transferOwnerPanel(t)}
        {this.deleteClanButton(t)}
      </div>
    );
  }
}

export default withTranslation()(MemberList);
