import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import ClanName from "../components/ClanName";
import LoadingScreen from "../components/LoadingScreen";
import { withTranslation } from "react-i18next";
const axios = require("axios");

class Diplomacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      clanid: localStorage.getItem("clanid"),
      isLoaded: false,
      error: null,
      listOfRelations: null,
      typedInput: 0,
      clanFlagInput: "",
      nameOtherClanInput: "",
      isLeader: false,
    };
  }

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
        params: {
          discordid: localStorage.getItem("discordid"),
          token: localStorage.getItem("token"),
          accion: "seerelationships",
        },
      })
      .then((response) => {
        if (response.status === 202) {
          this.setState({ listOfRelations: response.data });
        }
        this.setState({ isLoaded: true });
        if (
          this.state.listOfRelations != null &&
          this.state.listOfRelations[0].leaderid == this.state.user_discord_id
        ) {
          this.setState({ isLeader: true });
        }
      });
  }

  createRelationship = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          accion: "createrelationships",
          nameotherclan: this.state.nameOtherClanInput,
          clanflag: this.state.clanFlagInput,
          typed: this.state.typedInput,
        },
      })
      .catch((error) => {
        this.setState({ error: "Try again later" });
      });
  };

  deleteDiplomacy = (id) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/clans.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          accion: "deleterelationship",
          dataupdate: id,
        },
      })
      .then((response) => {
        if (response.status === 202) {
          this.componentDidMount();
        }
      })
      .catch((error) => {
        this.setState({ error: "Try again later" });
      });
  };

  listOfAllies() {
    if (this.state.listOfRelations != null) {
      var allies = this.state.listOfRelations.filter(
        (r) => r.typed == 1 || r.typed == 31
      );

      return allies.map((d) => (
        <div key={"ally" + d.id} className="col-12 row">
          <div className="col-10">
            <ClanName clan={d} />
          </div>
          <div className={this.state.isLeader ? "col-2" : "col-2 d-none"}>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => this.deleteDiplomacy(d.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ));
    }
  }

  listOfEnemies() {
    if (this.state.listOfRelations != null) {
      var allies = this.state.listOfRelations.filter(
        (r) => r.typed == 2 || r.typed == 32
      );

      return allies.map((d) => (
        <div key={"enemy" + d.id} className="col-12 row">
          <div className="col-10">
            <ClanName clan={d} />
          </div>
          <div className={this.state.isLeader ? "col-2" : "col-2 d-none"}>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => this.deleteDiplomacy(d.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ));
    }
  }

  listOfNAP() {
    if (this.state.listOfRelations != null) {
      var allies = this.state.listOfRelations.filter(
        (r) => r.typed == 0 || r.typed == 30
      );

      return allies.map((d) => (
        <div key={"npa" + d.id} className="col-12 row">
          <div className="col-10">
            <ClanName clan={d} />
          </div>
          <div className={this.state.isLeader ? "col-2" : "col-2 d-none"}>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => this.deleteDiplomacy(d.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ));
    }
  }

  createNewRelationship(t) {
    if (this.state.isLeader) {
      return (
        <div className="col-md-3">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <form onSubmit={this.createRelationship}>
                <div className="row">
                  <div className="form-group col">
                    <label htmlFor="typedInput">{t("Type")}</label>
                    <select
                      id="typedInput"
                      className="custom-select"
                      value={this.state.typedInput}
                      onChange={(evt) =>
                        this.setState({
                          typedInput: evt.target.value,
                        })
                      }
                    >
                      <option value="0">{t("NAP or Settler")}</option>
                      <option value="1">{t("Ally")}</option>
                      <option value="2">{t("War")}</option>
                    </select>
                  </div>
                  <div className="form-group col">
                    <label htmlFor="flag_color">{t("Flag Color")}</label>
                    <input
                      type="color"
                      className="form-control"
                      id="flag_color"
                      name="flag_color"
                      value={this.state.clanFlagInput}
                      onChange={(evt) =>
                        this.setState({
                          clanFlagInput: evt.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="nameOtherClanInput">{t("Clan Name")}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameOtherClanInput"
                    name="nameOtherClanInput"
                    maxLength="20"
                    value={this.state.nameOtherClanInput}
                    onChange={(evt) =>
                      this.setState({
                        nameOtherClanInput: evt.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button
                  className="btn btn-lg btn-outline-primary btn-block"
                  type="submit"
                  value="Submit"
                >
                  {t("Create a relationship")}
                </button>
              </form>
            </div>
          </div>
        </div>
      );
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
    } else if (
      this.state.clanid == "null" ||
      this.state.user_discord_id == null ||
      this.state.token == null
    ) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: t("You need to have a clan to access this section"),
            redirectPage: "/profile",
          }}
        />
      );
    }
    if (!this.state.isLoaded) {
      return <LoadingScreen />;
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <div className="card mb-4 shadow-sm border-success">
              <div className="card-header bg-success text-white text-center">
                {t("Allies")}
              </div>
              <div className="card-body">
                <div className="row">{this.listOfAllies()}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card mb-4 shadow-sm border-warning">
              <div className="card-header bg-warning text-dark text-center">
                {t("NAP or Settlers")}
              </div>
              <div className="card-body">{this.listOfNAP()}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card mb-4 shadow-sm border-danger">
              <div className="card-header bg-danger text-white text-center">
                {t("War")}
              </div>
              <div className="card-body">{this.listOfEnemies()}</div>
            </div>
          </div>
          {this.createNewRelationship(t)}
        </div>
      </div>
    );
  }
}

export default withTranslation()(Diplomacy);
