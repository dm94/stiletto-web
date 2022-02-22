import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import MapLayer from "../components/MapLayer";
import ResourcesInMapList from "../components/ResourcesInMapList";
import CreateResourceTab from "../components/CreateResourceTab";
import Axios from "axios";
import "../css/map-sidebar.min.css";
import {
  updateResourceTime,
  getMarkers,
  getResources,
  deleteResource,
  createResource,
} from "../services";
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

  async componentDidMount() {
    let parsed = null;
    if (this.props.location != null && this.props.location.search != null) {
      parsed = queryString.parse(this.props.location.search);
    }

    if (
      (this.props.mapId != null || this.props.match.params.id != null) &&
      (this.props.pass != null || parsed.pass != null)
    ) {
      let markers = await getMarkers();
      this.setState({ items: markers });

      let mapId =
        this.props.mapId != null
          ? this.props.mapId
          : this.props.match.params.id;
      let pass = this.props.pass ? this.props.pass : parsed.pass;

      this.setState({
        mapId: mapId,
        pass: pass,
      });

      let response = await getResources(mapId, pass);
      if (response.success) {
        this.setState({ resourcesInTheMap: response.message });
      } else {
        this.setState({ error: response.message });
      }

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

  deleteResource = async (resourceId, resourceToken) => {
    const response = await deleteResource(
      this.state.mapId,
      resourceId,
      resourceToken
    );
    if (response.success) {
      this.componentDidMount();
    } else {
      this.setState({ error: response.message });
    }
  };

  createResource = async (
    resourceTypeInput,
    qualityInput,
    descriptionInput,
    lastHarvested
  ) => {
    const response = await createResource(
      this.state.mapId,
      this.state.coordinateXInput,
      this.state.coordinateYInput,
      this.state.pass,
      resourceTypeInput,
      qualityInput,
      descriptionInput,
      lastHarvested
    );
    if (response.success) {
      this.componentDidMount();
    } else {
      this.setState({ error: response.message });
    }
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
