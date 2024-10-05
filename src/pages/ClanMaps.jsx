import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { closeSession, getMaps, getStoredItem } from "../services";
import ModalMessage from "../components/ModalMessage";
import ClanMapItem from "../components/ClanMaps/ClanMapItem";
import ResourceMap from "../components/ClanMaps/ResourceMap";
import CreateMapPanel from "../components/ClanMaps/CreateMapPanel";
import { getDomain } from "../functions/utils";

class ClanMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: getStoredItem("discordid"),
      token: getStoredItem("token"),
      maps: null,
      clanMaps: null,
      error: null,
      mapThatIsOpen: null,
      showDeleteModal: false,
      idMapDeleteModal: null,
    };
  }

  async componentDidMount() {
    const maps = await getMaps();
    this.setState({ maps: maps });

    Axios.get(`${process.env.REACT_APP_API_URL}/maps`, {
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        this.setState({ clanMaps: response.data });
      } else if (response.status === 401) {
        closeSession();
        this.setState({
          error: "You don't have access here, try to log in again",
        });
      } else if (response.status === 503) {
        this.setState({ error: "Error connecting to database" });
      }
    });
  }

  clanMapList() {
    if (this.state.clanMaps != null && this.state.maps != null) {
      return this.state.clanMaps.map((map) => (
        <ClanMapItem
          key={`clanmap${map.mapid}`}
          map={map}
          value={map.typemap}
          onOpen={(mapData) => {
            this.setState({ mapThatIsOpen: mapData });
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
      url: `${process.env.REACT_APP_API_URL}/maps/${mapid}`,
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
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
          closeSession();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  createMap = (event, mapNameInput, mapDateInput, mapSelectInput) => {
    event.preventDefault();
    const options = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/maps`,
      params: {
        discordid: this.state.user_discord_id,
        token: this.state.token,
        mapname: mapNameInput,
        mapdate: mapDateInput,
        maptype: `${mapSelectInput}_new`,
      },
    };

    if (getStoredItem("token") != null) {
      options.headers = {
        Authorization: `Bearer ${getStoredItem("token")}`,
      };
    }

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
          closeSession();
          this.setState({ error: "Login again" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  panel(t) {
    const showHideClassName = this.state.showDeleteModal
      ? "modal d-block"
      : "modal d-none";
    return (
      <div className="row">
        <Helmet>
          <title>Interactive Map List - Stiletto for Last Oasis</title>
          <meta
            name="description"
            content="Create, edit and share game maps by adding markers to them, e.g. to show where there is quality material or an enemy base."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Map List - Stiletto for Last Oasis"
          />
          <meta
            name="twitter:description"
            content="Create, edit and share game maps by adding markers to them, e.g. to show where there is quality material or an enemy base."
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
          />
          <link rel="canonical" href={`${getDomain()}/maps`} />
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
          key={`mapOpen${this.state.mapThatIsOpen.mapid}`}
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
            text: this.state.error,
            redirectPage: "/profile",
          }}
        />
      );
    }
    if (this.state.user_discord_id == null || this.state.token == null) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: "Login again",
            redirectPage: "/profile",
          }}
        />
      );
    }

    return <div className="container">{this.panel(t)}</div>;
  }
}

export default withTranslation()(ClanMaps);
