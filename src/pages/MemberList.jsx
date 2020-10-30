import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import MemberListItem from "../components/MemberListItem";
import RequestMemberListItem from "../components/RequestMemberListItem";

const axios = require("axios");

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
    };
  }

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
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
        this.setState({ error: "Try again later" });
      });

    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
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
          error: "Error when loading the list of applications. Try again later",
        });
      });
  }

  kickMember = (memberdiscordid) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
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
        this.setState({ error: "Try again later" });
      });
  };

  acceptMember = (memberdiscordid) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
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
        this.setState({ error: "Try again later" });
      });
  };

  rejectMember = (memberdiscordid) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
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
        this.setState({ error: "Try again later" });
      });
  };

  deleteClan = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
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
        this.setState({ error: "Try again later" });
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

  requestList() {
    if (this.state.isLoadedRequestList) {
      if (this.state.requestMembers != null) {
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
            <td colSpan="4">There are no pending requests</td>
          </tr>
        );
      }
    } else {
      return (
        <tr>
          <td colSpan="4">Loading the list of requests to enter the clan</td>
        </tr>
      );
    }
  }

  deleteClanButton() {
    if (
      this.state.members != null &&
      this.state.members[0].leaderid == localStorage.getItem("discordid")
    ) {
      return (
        <div className="col-xl-12">
          <div className="card mb-3">
            <div className="card-body">
              <button
                className="btn btn-block btn-danger"
                onClick={() => this.deleteClan()}
              >
                Delete Clan
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
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
    } else if (
      this.state.clanid == "null" ||
      this.state.user_discord_id == null ||
      this.state.token == null
    ) {
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

    return (
      <div className="row">
        {this.deleteClanButton()}
        <div className="col-xl-6">
          <div className="card mb-3">
            <div className="card-header">Member List</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center" scope="col">
                      Discord Tag
                    </th>
                    <th className="text-center" scope="col">
                      Nick in game
                    </th>
                    <th className="text-center" scope="col">
                      Kick
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
            <div className="card-header">List of requests</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center" scope="col">
                      Discord Tag
                    </th>
                    <th className="text-center" scope="col">
                      Nick in game
                    </th>
                    <th className="text-center" scope="col">
                      Accept
                    </th>
                    <th className="text-center" scope="col">
                      Reject
                    </th>
                  </tr>
                </thead>
                <tbody>{this.requestList()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MemberList;
