import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import ClanMapItem from "../components/ClanMapItem";
import ResourceMap from "../components/ResourceMap";
import CreateMapPanel from "../components/CreateMapPanel";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";

class ClanMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      maps: null,
      clanMaps: null,
      error: null,
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

    Axios.get(process.env.REACT_APP_API_URL + "/maps", {
      params: {
        discordid: localStorage.getItem("discordid"),
        token: localStorage.getItem("token"),
      },
    }).then((response) => {
      if (response.status === 200) {
        this.setState({ clanMaps: response.data });
      } else if (response.status === 401) {
        localStorage.clear();
        this.setState({
          error: "You don't have access here, try to log in again",
        });
      } else if (response.status === 503) {
        this.setState({ error: "Error connecting to database" });
      }
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
          onOpen={(map) => {
            this.setState({ mapThatIsOpen: map });
          }}
          onDelete={(mapid) => {
            this.setState({ showDeleteModal: true, idMapDeleteModal: mapid });
          }}
        />
      ));
    }
  }

  deleteMap = (mapid) => {
    const options = {
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/maps/" + mapid,
      params: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 204) {
          this.setState({
            showDeleteModal: false,
            idMapDeleteModal: null,
          });
          this.componentDidMount();
        } else if (response.status === 401) {
          localStorage.clear();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  getNameMap = (typemap) => {
    if (this.state.maps != null) {
      var m = this.state.maps.filter((m) => {
        return m.idMap === typemap;
      });
      if (m[0] != null) {
        return m[0].name;
      }
    }
    return "Crater";
  };

  createMap = (event, mapNameInput, mapDateInput, mapSelectInput) => {
    event.preventDefault();
    const options = {
      method: "post",
      url: process.env.REACT_APP_API_URL + "/maps",
      params: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
        mapname: mapNameInput,
        mapdate: mapDateInput,
        maptype: mapSelectInput,
      },
    };

    Axios.request(options)
      .then((response) => {
        this.setState({
          mapNameInput: "",
          mapDateInput: "",
          mapSelectInput: "",
        });
        if (response.status === 201) {
          this.componentDidMount();
        } else if (response.status === 401) {
          localStorage.clear();
          this.setState({ error: "Login again" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  panel(t) {
    let showHideClassName = this.state.showDeleteModal
      ? "modal d-block"
      : "modal d-none";
    return (
      <div className="row">
        <Helmet>
          <title>{t("Map List")} - Stiletto</title>
          <meta
            name="description"
            content="Create, edit and share game maps by adding markers to them, e.g. to show where there is quality material or an enemy base."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Map List - Stiletto" />
          <meta
            name="twitter:description"
            content="Create, edit and share game maps by adding markers to them, e.g. to show where there is quality material or an enemy base."
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
          />
          <link
            rel="canonical"
            href={
              window.location.protocol
                .concat("//")
                .concat(window.location.hostname) +
              (window.location.port ? ":" + window.location.port : "") +
              "/maps"
            }
          />
        </Helmet>
        <div className="col-xl-12">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Map List")}</div>
            <div className="card-body row">{this.clanMapList()}</div>
          </div>
        </div>
        <CreateMapPanel maps={this.state.maps} onCreateMap={this.createMap} />
        <div className={showHideClassName}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deletemapmodal">
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
            text: t("Login again"),
            redirectPage: "/profile",
          }}
        />
      );
    }

    return <div className="container">{this.panel(t)}</div>;
  }
}

export default withTranslation()(ClanMaps);
