import React, { Component } from "react";
import ModalMessage from "./ModalMessage";
import LoadingScreen from "./LoadingScreen";
import MemberListItem from "./MemberListItem";
import RequestMemberListItem from "./RequestMemberListItem";

const axios = require("axios");

class MemberList extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      clanid: localStorage.getItem("clanid"),
      urlApi: "https://api.comunidadgzone.es/v1",
      isLoaded: false,
      members: null,
      requestMembers: null,
      error: null,
      isLoadedRequestList: false,
    };
  }

  componentDidMount() {
    axios
      .get(this.state.urlApi + "/clans", {
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
      .get(this.state.urlApi + "/clans", {
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
      .get(this.state.urlApi + "/clans", {
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
      .get(this.state.urlApi + "/clans", {
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

          axios
            .get(this.state.urlApi + "/clans", {
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
      .get(this.state.urlApi + "/clans", {
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

  list() {
    if (this.state.isLoaded) {
      if (this.state.members != null) {
        return this.state.members.map((member) => (
          <MemberListItem
            key={member.discordid}
            member={member}
            onKick={this.kickMember}
          />
        ));
      }
    } else {
      return (
        <tr>
          <LoadingScreen />
        </tr>
      );
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
    } else if (
      this.state.clanid == null ||
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

    return (
      <div className="row">
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
