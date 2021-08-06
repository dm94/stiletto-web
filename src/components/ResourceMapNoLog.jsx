import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import MapLayer from "../components/MapLayer";
import ResourcesInMapList from "../components/ResourcesInMapList";
import CreateResourceTab from "../components/CreateResourceTab";
import { Helmet } from "react-helmet";
import Axios from "axios";
import "../css/map-sidebar.min.css";
import { updateResourceTime } from "../services";
const queryString = require("query-string");

class ResourceMapNoLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resourcesInTheMap: null,
      mapId: null,
      pass: null,
      isLoaded: false,
      textMessage: null,
      center: null,
      items: null,
      coordinateXInput: 0,
      coordinateYInput: 0,
      resourcesFiltered: null,
      error: null,
      mapData: null,
      isOpenSidebar: false,
    };
  }
  componentDidMount() {
    let parsed = null;
    if (this.props.location != null && this.props.location.search != null) {
      parsed = queryString.parse(this.props.location.search);
    }

    if (
      (this.props.mapId != null || this.props.match.params.id != null) &&
      (this.props.pass != null || parsed.pass != null)
    ) {
      Axios.get(
        "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/markers.json"
      ).then((response) => {
        this.setState({ items: response.data });
      });

      let mapId =
        this.props.mapId != null
          ? this.props.mapId
          : this.props.match.params.id;
      let pass = this.props.pass ? this.props.pass : parsed.pass;

      this.setState({
        mapId: mapId,
        pass: pass,
      });

      Axios.get(
        process.env.REACT_APP_API_URL + "/maps/" + mapId + "/resources",
        {
          params: {
            discordid: localStorage.getItem("discordid"),
            token: localStorage.getItem("token"),
            mappass: pass,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => {
        if (response.status === 200) {
          this.setState({ resourcesInTheMap: response.data });
        } else if (response.status === 401) {
          this.setState({
            error: "Unauthorized",
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      });

      Axios.get(process.env.REACT_APP_API_URL + "/maps/" + mapId, {
        params: {
          mappass: pass,
        },
      }).then((response) => {
        if (response.status === 200) {
          this.setState({ mapData: response.data });
        } else if (response.status === 401) {
          this.setState({
            error: "Unauthorized",
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      });
    } else {
      this.setState({ error: "Unauthorized" });
    }
  }

  deleteResource = (resourceid, resourcetoken) => {
    const options = {
      method: "delete",
      url:
        process.env.REACT_APP_API_URL +
        "/maps/" +
        this.state.mapId +
        "/resources/" +
        resourceid,
      params: {
        token: resourcetoken,
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
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  createResource = (
    resourceTypeInput,
    qualityInput,
    descriptionInput,
    lastHarvested
  ) => {
    const options = {
      method: "post",
      url:
        process.env.REACT_APP_API_URL +
        "/maps/" +
        this.state.mapId +
        "/resources",
      params: {
        discordid: localStorage.getItem("discordid"),
        token: localStorage.getItem("token"),
        mapid: this.state.mapId,
        resourcetype: resourceTypeInput,
        quality: qualityInput,
        x: this.state.coordinateXInput,
        y: this.state.coordinateYInput,
        description: descriptionInput,
        mappass: this.state.pass,
        harvested: lastHarvested,
      },
    };

    Axios.request(options)
      .then((response) => {
        this.setState({
          coordinateXInput: 0,
          coordinateYInput: 0,
        });
        if (response.status === 202) {
          this.componentDidMount();
        } else if (response.status === 401) {
          this.setState({ error: "Unauthorized" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  filterResources = (r) => {
    if (r === "All") {
      this.setState({ resourcesFiltered: null });
    } else {
      let resourcesFiltered = this.state.resourcesInTheMap.filter(
        (resource) => resource.resourcetype === r
      );
      this.setState({ resourcesFiltered: resourcesFiltered });
    }
  };

  render() {
    const { t } = this.props;
    if (this.state.isLoaded) {
      return <LoadingScreen />;
    }
    if (this.state.textMessage != null) {
      return (
        <ModalMessage
          message={{
            isError: false,
            text: this.state.textMessage,
            redirectPage: null,
          }}
          onClickOk={() => this.setState({ textMessage: null })}
        />
      );
    }
    if (this.state.error != null) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: this.state.error,
            redirectPage: "/",
          }}
        />
      );
    }
    return (
      <div className="row flex-xl-nowrap">
        <Helmet>
          <title>{t("Map")} - Stiletto for Last Oasis</title>
          <meta
            name="description"
            content="Map of resources shared through a link"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Map - Stiletto for Last Oasis" />
          <meta
            name="twitter:description"
            content="Map of resources shared through a link"
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
              "/map/" +
              this.state.mapId
            }
          />
        </Helmet>
        <div
          id="map-sidebar"
          className={
            this.state.isOpenSidebar
              ? "position-absolute bg-secondary p-1 open"
              : "position-absolute bg-secondary p-1"
          }
        >
          <button
            id="toggle-sidebar-button"
            className="btn btn-info ml-2 mb-2 float-right"
            onClick={() =>
              this.setState((state) => ({
                isOpenSidebar: !state.isOpenSidebar,
              }))
            }
          >
            <i
              className={
                this.state.isOpenSidebar
                  ? "fas fa-chevron-left"
                  : "fas fa-chevron-right"
              }
            ></i>
          </button>
          <nav className="collapse show" id="items-nav" aria-label="Items Navs">
            <ul className="nav nav-pills nav-fill" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  id="resource-list-tab"
                  data-toggle="tab"
                  href="#resourcelist"
                  role="tab"
                  aria-controls="resourcelist"
                  aria-selected="false"
                >
                  {t("List")}
                </a>
              </li>
              <li
                className={
                  this.state.mapData != null &&
                  this.state.mapData.allowedit != null &&
                  parseInt(this.state.mapData.allowedit) === 1
                    ? "nav-item"
                    : "d-none"
                }
                role="presentation"
              >
                <a
                  className="nav-link"
                  id="add-resource-tab"
                  data-toggle="tab"
                  href="#addresource"
                  role="tab"
                  aria-controls="addresource"
                  aria-selected="true"
                >
                  {t("Create resource")}
                </a>
              </li>
            </ul>
            <div className="tab-content border border-primary">
              <div
                className="tab-pane fade show active"
                id="resourcelist"
                role="tabpanel"
                aria-labelledby="resource-list-tab"
              >
                <ul
                  className="list-group overflow-auto w-100"
                  style={{ height: "60vh" }}
                >
                  <ResourcesInMapList
                    resources={this.state.resourcesInTheMap}
                    onSelect={(x, y) => this.setState({ center: [x, y] })}
                    onFilter={this.filterResources}
                  />
                </ul>
              </div>
              <div
                className="tab-pane fade"
                id="addresource"
                role="tabpanel"
                aria-labelledby="add-resource-tab"
              >
                <CreateResourceTab
                  items={this.state.items}
                  onCreateResource={this.createResource}
                  coordinateXInput={this.state.coordinateXInput}
                  coordinateYInput={this.state.coordinateYInput}
                  onChangeX={(x) =>
                    this.setState({
                      coordinateXInput: x,
                    })
                  }
                  onChangeY={(y) =>
                    this.setState({
                      coordinateYInput: y,
                    })
                  }
                />
              </div>
            </div>
          </nav>
        </div>
        <div className="col-12">
          <div className="col-xl-12 text-center">
            <h1>
              {this.state.resourcesInTheMap != null &&
              this.state.resourcesInTheMap[0] != null &&
              this.state.resourcesInTheMap[0].name != null
                ? this.state.resourcesInTheMap[0].name
                : ""}
            </h1>
          </div>
          <MapLayer
            key={this.state.mapId}
            resourcesInTheMap={
              this.state.resourcesFiltered != null
                ? this.state.resourcesFiltered
                : this.state.resourcesInTheMap
            }
            deleteResource={this.deleteResource}
            updateResource={(mapid, resourceid, token, date) => {
              updateResourceTime(mapid, resourceid, token, date);
              this.componentDidMount();
            }}
            changeInput={(x, y) => {
              this.setState({
                coordinateXInput: x,
                coordinateYInput: y,
              });
            }}
            center={this.state.center}
          ></MapLayer>
        </div>
      </div>
    );
  }
}

export default withTranslation()(ResourceMapNoLog);
