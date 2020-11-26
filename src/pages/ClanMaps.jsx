import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import ClanMapItem from "../components/ClanMapItem";
import ResourceMap from "../components/ResourceMap";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
const axios = require("axios");

class ClanMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      isLoaded: false,
      maps: null,
      clanMaps: null,
      error: null,
      mapNameInput: "",
      mapDateInput: "",
      mapSelectInput: 1,
      mapThatIsOpen: null,
      showDeleteModal: false,
      idMapDeleteModal: null,
    };
  }

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/maps.json"
    )
      .then((response) => response.json())
      .then((maps) => this.setState({ maps }));

    axios
      .get(process.env.REACT_APP_API_URL + "/maps.php", {
        params: {
          discordid: localStorage.getItem("discordid"),
          token: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ clanMaps: response.data });
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
        this.setState({ isLoaded: true });
      });
  }

  mapSelect() {
    if (this.state.maps != null) {
      return this.state.maps.map((map) => (
        <div
          className="m-2 col-sm-2 col-xl text-center"
          key={"selectmap" + map.idMap}
        >
          <img
            src={map.image}
            className={
              map.name == this.state.mapSelectInput
                ? "img-fluid img-thumbnail"
                : "img-fluid"
            }
            alt={map.name}
            id={map.name}
            onClick={(evt) =>
              this.setState({
                mapSelectInput: evt.target.id,
              })
            }
          />
          <h6>{map.name}</h6>
        </div>
      ));
    }
  }

  clanMapList() {
    if (this.state.clanMaps != null && this.state.maps != null) {
      return this.state.clanMaps.map((map) => (
        <ClanMapItem
          key={"clanmap" + map.mapid}
          map={map}
          value={map.typemap}
          onOpen={this.openMap}
          onDelete={(mapid) => {
            this.setState({ showDeleteModal: true, idMapDeleteModal: mapid });
          }}
        />
      ));
    }
  }

  openMap = (map) => {
    this.setState({ mapThatIsOpen: map });
  };

  deleteMap = (mapid) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/maps.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          accion: "deletemap",
          dataupdate: mapid,
        },
      })
      .then((response) => {
        if (response.status === 202) {
          this.setState({
            showDeleteModal: false,
            idMapDeleteModal: null,
          });
          this.componentDidMount();
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  getImageMap(typemap) {
    if (this.state.maps != null) {
      var m = this.state.maps.filter((m) => {
        return m.idMap === typemap;
      });
      if (m[0] != null) {
        return m[0].image;
      }
    }
    return process.env.REACT_APP_MAPS_URL + "Crater.jpg";
  }

  getNameMap(typemap) {
    if (this.state.maps != null) {
      var m = this.state.maps.filter((m) => {
        return m.idMap === typemap;
      });
      if (m[0] != null) {
        return m[0].name;
      }
    }
    return "Crater";
  }

  createMap = (event) => {
    event.preventDefault();
    axios
      .get(process.env.REACT_APP_API_URL + "/maps.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
          accion: "addmap",
          mapName: this.state.mapNameInput,
          mapDate: this.state.mapDateInput,
          mapType: this.state.mapSelectInput,
        },
      })
      .then((response) => {
        this.setState({
          mapNameInput: "",
          mapDateInput: "",
          mapSelectInput: "",
        });
        if (response.status === 202) {
          this.componentDidMount();
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({ error: "Login again" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  createMapPanel(t) {
    let showHideClassName = this.state.showDeleteModal
      ? "modal d-block"
      : "modal d-none";
    return (
      <div className="row">
        <Helmet>
          <title>Map List - Stiletto</title>
          <meta name="description" content="List of resource maps" />
        </Helmet>
        <div className="col-xl-12">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Map List")}</div>
            <div className="card-body row">{this.clanMapList()}</div>
          </div>
        </div>
        <div className="col-xl-12">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("New Map")}</div>
            <div className="card-body text-succes">
              <form onSubmit={this.createMap}>
                <div className="row">
                  <div className="col-xl-6 col-sm-12 form-group">
                    <label htmlFor="map_name">{t("Map Name")}</label>
                    <input
                      type="text"
                      className="form-control"
                      id="map_name"
                      name="map_name"
                      maxLength="30"
                      value={this.state.mapNameInput}
                      onChange={(evt) =>
                        this.setState({
                          mapNameInput: evt.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="col-xl-6 col-sm-12 form-group">
                    <label htmlFor="map_date">{t("Date of burning")}</label>
                    <input
                      type="date"
                      className="form-control"
                      id="map_date"
                      name="map_date"
                      value={this.state.mapDateInput}
                      onChange={(evt) =>
                        this.setState({
                          mapDateInput: evt.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="col-xl-12 col-sm-12 form-group">
                  <p className="text-center">{t("Map Type")}</p>
                  <div name="mapselect" className="row">
                    {this.mapSelect()}
                  </div>
                </div>
                <button
                  className="btn btn-lg btn-outline-success btn-block"
                  type="submit"
                  value="Submit"
                >
                  {t("Create new map")}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className={showHideClassName}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteusermodal">
                  {t("Are you sure?")}
                </h5>
              </div>
              <div className="modal-body">
                {t("This option is not reversible")}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    this.setState({
                      showDeleteModal: false,
                      idMapDeleteModal: null,
                    })
                  }
                >
                  {t("Cancel")}
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => this.deleteMap(this.state.idMapDeleteModal)}
                >
                  {t("Delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    if (this.state.mapThatIsOpen) {
      return (
        <ResourceMap
          key={"mapOpen" + this.state.mapThatIsOpen.mapid}
          onReturn={() => this.setState({ mapThatIsOpen: null })}
          map={this.state.mapThatIsOpen}
          value={this.getNameMap(this.state.mapThatIsOpen.typemap)}
        />
      );
    }
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
    } else if (this.state.user_discord_id == null || this.state.token == null) {
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

    return <div className="container">{this.createMapPanel(t)}</div>;
  }
}

export default withTranslation()(ClanMaps);
