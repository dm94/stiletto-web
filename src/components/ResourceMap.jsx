import React, { Component } from "react";
import L from "leaflet";

class ResourceMap extends Component {
  state = {};

  componentDidMount() {
    var mapSW = [0, 16384],
      mapNE = [16384, 0];

    var map = L.map("map", {
      center: [8192, 8192],
      zoom: 2,
      contextmenu: true,
    });

    L.tileLayer("./img/maps/SleepingGiantsB/{z}/{x}/{y}.png", {
      minZoom: 1,
      maxZoom: 6,
      noWrap: true,
      crs: L.CRS.Simple,
    }).addTo(map);

    map.setMaxBounds(
      new L.LatLngBounds(
        map.unproject(mapSW, map.getMaxZoom()),
        map.unproject(mapNE, map.getMaxZoom())
      )
    );
  }

  render() {
    return (
      <div className="row">
        <div className="card border-secondary mb-3">
          <div className="card-body">
            <form>
              <div className="form-group">
                <label htmlFor="clan_name">Clan Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="clan_name"
                  name="clan_name"
                  maxLength="20"
                  value={this.state.addClanNameInput}
                  onChange={(evt) =>
                    this.setState({
                      addClanNameInput: evt.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="flag_color">Flag Color</label>
                <input
                  type="color"
                  className="form-control"
                  id="flag_color"
                  name="flag_color"
                  value={this.state.addClanColorInput}
                  onChange={(evt) =>
                    this.setState({
                      addClanColorInput: evt.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="discord_invite">
                  Discord Link Invite (Optional)
                </label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      https://discord.gg/
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="discord_invite"
                    name="discord_invite"
                    maxLength="10"
                    value={this.state.addClanDiscordInput}
                    onChange={(evt) =>
                      this.setState({
                        addClanDiscordInput: evt.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <button
                className="btn btn-lg btn-outline-success btn-block"
                type="submit"
                value="Submit"
              >
                Create a clan
              </button>
            </form>
          </div>
        </div>
        <div id="map" className="col-xl-9 position-fixed"></div>
      </div>
    );
  }
}

export default ResourceMap;
