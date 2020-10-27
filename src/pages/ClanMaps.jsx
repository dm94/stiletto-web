import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import ClanMapItem from "../components/ClanMapItem";
import ResourceMap from "../components/ResourceMap";

const axios = require("axios");

class ClanMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      clanid: localStorage.getItem("clanid"),
      isLoaded: false,
      maps: null,
      clanMaps: null,
      error: null,
      mapNameInput: "",
      mapDateInput: "",
      mapSelectInput: 1,
      mapThatIsOpen: null,
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
              map.idMap == this.state.mapSelectInput
                ? "img-fluid img-thumbnail"
                : "img-fluid"
            }
            alt={map.name}
            id={map.idMap}
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
          value={this.getImageMap(map.typemap)}
          onOpen={this.openMap}
          onDelete={this.deleteMap}
        />
      ));
    }
  }

  openMap = (map) => {
    this.setState({ mapThatIsOpen: map });
  };

  deleteMap = (mapid) => {
    console.log("Borrando mapa " + mapid);
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
          this.componentDidMount();
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({ error: "Login again" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Try again later" });
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
    return "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/maps/crater.jpg";
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
        this.setState({ error: "Try again later" });
      });
  };

  createMapPanel() {
    return (
      <div className="row">
        <div className="col-xl-12">
          <div className="card border-secondary mb-3">
            <div className="card-header">Map List</div>
            <div className="card-body row">{this.clanMapList()}</div>
          </div>
        </div>
        <div className="col-xl-12">
          <div className="card border-secondary mb-3">
            <div className="card-header">New Map</div>
            <div className="card-body text-succes">
              <form onSubmit={this.createMap}>
                <div className="row">
                  <div className="col-xl-6 col-sm-12 form-group">
                    <label htmlFor="map_name">Map Name</label>
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
                    <label htmlFor="map_date">Date of burning</label>
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
                  <p className="text-center">Map Type</p>
                  <div name="mapselect" className="row">
                    {this.mapSelect()}
                  </div>
                </div>
                <button
                  className="btn btn-lg btn-outline-success btn-block"
                  type="submit"
                  value="Submit"
                >
                  Create new map
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
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
            text: "You have to be connected and have a clan to enter here",
            redirectPage: "/profile",
          }}
        />
      );
    }

    return <div className="container">{this.createMapPanel()}</div>;
  }
}

export default ClanMaps;
