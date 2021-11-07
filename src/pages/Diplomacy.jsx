import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import ClanSelect from "../components/ClanSelect";
import LoadingScreen from "../components/LoadingScreen";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { getUserProfile, getHasPermissions } from "../services";

class Diplomacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clanid: null,
      isLoaded: false,
      error: null,
      listOfRelations: null,
      typedInput: 0,
      clanFlagInput: "",
      clanFlagSymbolInput: "C1",
      nameOtherClanInput: "",
      isLeader: false,
      hasPermissions: false,
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

    Axios.get(
      process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanid +
        "/relationships",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 202) {
          this.setState({ listOfRelations: response.data, isLoaded: true });
        } else if (response.status === 405) {
          this.setState({ error: "Unauthorized" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });

    let hasPermissions = await getHasPermissions("diplomacy");
    this.setState({ hasPermissions: hasPermissions });
  }

  createRelationship = (event) => {
    event.preventDefault();
    const options = {
      method: "post",
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanid +
        "/relationships",
      params: {
        nameotherclan: this.state.nameOtherClanInput,
        clanflag: this.state.clanFlagInput,
        typed: this.state.typedInput,
        symbol: this.state.clanFlagSymbolInput,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 201) {
          this.componentDidMount();
        } else if (response.status === 405) {
          this.setState({ error: "Method Not Allowed" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Try again later" });
      });
  };

  deleteDiplomacy = (id) => {
    const options = {
      method: "delete",
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanid +
        "/relationships/" +
        id,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 204) {
          this.componentDidMount();
        } else if (response.status === 401) {
          this.setState({ error: "Unauthorized" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Try again later" });
      });
  };

  listOfAllies() {
    if (this.state.listOfRelations != null) {
      let allies = this.state.listOfRelations.filter(
        (r) => r.typed == 1 || r.typed == 31
      );

      return allies.map((d) => (
        <div key={"ally" + d.id} className="col-12">
          <ClanSelect
            clan={d}
            leader={this.state.isLeader || this.state.hasPermissions}
            onDelete={this.deleteDiplomacy}
          />
        </div>
      ));
    }
  }

  listOfEnemies() {
    if (this.state.listOfRelations != null) {
      let enemies = this.state.listOfRelations.filter(
        (r) => r.typed == 2 || r.typed == 32
      );

      return enemies.map((d) => (
        <div key={"enemy" + d.id} className="col-12">
          <ClanSelect
            clan={d}
            leader={this.state.isLeader || this.state.hasPermissions}
            onDelete={this.deleteDiplomacy}
          />
        </div>
      ));
    }
  }

  listOfNAP() {
    if (this.state.listOfRelations != null) {
      let nap = this.state.listOfRelations.filter(
        (r) => r.typed == 0 || r.typed == 30
      );

      return nap.map((d) => (
        <div key={"npa" + d.id} className="col-12">
          <ClanSelect
            clan={d}
            leader={this.state.isLeader || this.state.hasPermissions}
            onDelete={this.deleteDiplomacy}
          />
        </div>
      ));
    }
  }

  createNewRelationship(t) {
    if (this.state.isLeader || this.state.hasPermissions) {
      return (
        <div className="col-md-12">
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
                <div className="form-group">
                  <label htmlFor="sigilClanFlagInput">{t("Symbol")}</label>
                  <div className="col-12">
                    <div className="row">{this.symbolsList()}</div>
                  </div>
                </div>
                <button
                  className="btn btn-lg btn-outline-info btn-block"
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

  symbolsList() {
    const symbols = [];
    for (let i = 1; i < 31; i++) {
      symbols.push("C" + i);
    }
    return symbols.map((symbol) => (
      <div className="col-1" key={"symbol-" + symbol}>
        <img
          src={
            process.env.REACT_APP_API_GENERAL_URL +
            "/symbols/" +
            symbol +
            ".png"
          }
          className={
            symbol === this.state.clanFlagSymbolInput
              ? "img-fluid img-thumbnail"
              : "img-fluid"
          }
          alt={symbol}
          id={"symbol-img-" + symbol}
          onClick={() => this.setState({ clanFlagSymbolInput: symbol })}
        />
      </div>
    ));
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
    } else if (this.state.clanid === null) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: "You need to have a clan to access this section",
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
        <Helmet>
          <title>{t("Diplomacy")} - Stiletto for Last Oasis</title>
          <meta
            name="description"
            content="View your clan's list of allies, enemies and NAP"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Diplomacy - Stiletto for Last Oasis"
          />
          <meta
            name="twitter:description"
            content="View your clan's list of allies, enemies and NAP"
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
              "/diplomacy"
            }
          />
        </Helmet>
        <div className="row">
          {this.createNewRelationship(t)}
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm border-success">
              <div className="card-header bg-success text-white text-center">
                {t("Allies")}
              </div>
              <div className="card-body">
                <div className="row">{this.listOfAllies()}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm border-warning">
              <div className="card-header bg-warning text-dark text-center">
                {t("NAP or Settlers")}
              </div>
              <div className="card-body">{this.listOfNAP()}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm border-danger">
              <div className="card-header bg-danger text-white text-center">
                {t("War")}
              </div>
              <div className="card-body">{this.listOfEnemies()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Diplomacy);
