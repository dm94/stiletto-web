import React, { Component } from "react";
import ModalMessage from "./ModalMessage";
import LoadingScreen from "./LoadingScreen";

const axios = require("axios");

class ClanMaps extends Component {
  state = {};

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
    };
  }

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/maps.json"
    )
      .then((response) => response.json())
      .then((maps) => this.setState({ maps }));
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
    if (this.state.clanMaps != null) {
      return this.state.clanMaps.map((map) => (
        <div className="m-2 col-sm-2 col-xl text-center">
          <h6>{map.name}</h6>
        </div>
      ));
    } else {
      return <LoadingScreen />;
    }
  }

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
              <form>
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
                  Create new map (Don´t work)
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
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

    return <div className="container">{this.createMapPanel()}</div>;
  }
}

export default ClanMaps;
