import React, { Component } from "react";
import Axios from "axios";
import { withTranslation } from "react-i18next";
import {
  updateResourceTime,
  getMarkers,
  getResources,
  deleteResource,
  createResource,
} from "../../services";
import ModalMessage from "../ModalMessage";
import MapLayer from "./MapLayer";
import ResourcesInMapList from "./ResourcesInMapList";
import CreateResourceTab from "./CreateResourceTab";
import "../../css/map-sidebar.min.css";

class ResourceMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      coordinateXInput: 0,
      coordinateYInput: 0,
      items: null,
      resourcesInTheMap: null,
      latlng: null,
      pass: this.props.map.pass,
      textSuccess: null,
      center: null,
      mapname: this.props.map.name,
      dateofburning: this.props.map.dateofburning,
      allowEditing: this.props.map.allowedit,
      resourcesFiltered: null,
      isOpenSidebar: window.innerWidth >= 1440,
    };
  }

  async componentDidMount() {
    let markers = await getMarkers();
    this.setState({ items: markers });

    let response = await getResources(
      this.props.map.mapid,
      this.props.map.pass
    );
    if (response.success) {
      this.setState({ resourcesInTheMap: response.message });
    } else {
      this.setState({ error: response.message });
    }
  }

  createResource = async (
    resourceTypeInput,
    qualityInput,
    descriptionInput,
    lastHarvested
  ) => {
    const response = await createResource(
      this.props.map.mapid,
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

  changeDataMap = (event) => {
    event.preventDefault();

    const options = {
      method: "put",
      url: process.env.REACT_APP_API_URL + "/maps/" + this.props.map.mapid,
      params: {
        mapname: this.state.mapname,
        mapdate: this.state.dateofburning,
        allowediting: this.state.allowEditing ? 1 : 0,
        mappass: this.state.pass,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 202) {
          this.setState({ textSuccess: "Map updated" });
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

  deleteResource = async (resourceId, resourceToken) => {
    const response = await deleteResource(
      this.props.map.mapid,
      resourceId,
      resourceToken
    );
    if (response.success) {
      this.componentDidMount();
    } else {
      this.setState({ error: response.message });
    }
  };

  editMapTab(t) {
    if (this.state.user_discord_id === this.props.map.discordid) {
      return (
        <div className="card-body">
          <form onSubmit={this.changeDataMap}>
            <div className="form-group">
              <label htmlFor="mapname">{t("Map Name")}</label>
              <input
                type="text"
                className="form-control"
                id="mapname"
                onChange={(evt) => this.setState({ mapname: evt.target.value })}
                value={this.state.mapname}
                maxLength="30"
                required
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="mapdate">{t("Date of burning")}</label>
              <input
                type="date"
                className="form-control"
                id="mapdate"
                onChange={(evt) =>
                  this.setState({ dateofburning: evt.target.value })
                }
                value={this.state.dateofburning}
                required
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="mapdate">
                {t("Enable editing with the link")}
              </label>
              <div className="btn-group">
                <button
                  className={
                    this.state.allowEditing == true
                      ? "btn btn-success active"
                      : "btn btn-success"
                  }
                  onClick={() => {
                    this.setState({ allowEditing: true });
                  }}
                  type="button"
                >
                  {t("Allow Editing")}
                </button>
                <button
                  className={
                    this.state.allowEditing == true
                      ? "btn btn-danger"
                      : "btn btn-danger active"
                  }
                  onClick={() => {
                    this.setState({ allowEditing: false });
                  }}
                  type="button"
                >
                  {t("Read Only")}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">{t("Password")}</label>
              <input
                type="text"
                className="form-control"
                id="password"
                onChange={(evt) => this.setState({ pass: evt.target.value })}
                value={this.state.pass}
                maxLength="20"
                required
              ></input>
            </div>
            <button
              className="btn btn-lg btn-outline-success btn-block"
              type="submit"
              value="Submit"
            >
              {t("Update Data")}
            </button>
          </form>
        </div>
      );
    }
  }

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
    if (this.state.user_discord_id == null || this.state.token == null) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: "Login with discord",
            redirectPage: "/profile",
          }}
        />
      );
    } else if (this.state.error != null) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: this.state.error,
            redirectPage: "/profile",
          }}
        />
      );
    } else if (this.state.textSuccess != null) {
      return (
        <ModalMessage
          message={{
            isError: false,
            text: this.state.textSuccess,
            redirectPage: null,
          }}
          onClickOk={() => this.setState({ textSuccess: null })}
        />
      );
    }
    return (
      <div className="row flex-xl-nowrap">
        <div
          id="map-sidebar"
          className={
            this.state.isOpenSidebar
              ? "col-xl-3 col-sm-12 position-absolute bg-secondary p-1 open"
              : "position-absolute bg-secondary p-1"
          }
        >
          <div>
            <button
              className="btn btn-sm btn-primary btn-block mb-2"
              onClick={() => this.props.onReturn()}
            >
              <i className="fas fa-arrow-left"></i>{" "}
              {t("Back to the list of maps")}
            </button>
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
          </div>
          <nav className="collapse show" id="items-nav" aria-label="Items Navs">
            <ul className="nav nav-pills nav-fill" role="tablist">
              <li
                className={
                  this.props.map.allowedit ||
                  parseInt(this.props.map.allowedit) === 1 ||
                  this.state.user_discord_id === this.props.map.discordid
                    ? "nav-item"
                    : "nav-item d-none"
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
                  this.state.user_discord_id === this.props.map.discordid
                    ? "nav-item"
                    : "nav-item d-none"
                }
              >
                <a
                  className="nav-link"
                  id="edit-map-tab"
                  data-toggle="tab"
                  href="#editmap"
                  role="tab"
                  aria-controls="editmap"
                  aria-selected="false"
                >
                  {t("Edit")}
                </a>
              </li>
            </ul>
            <div className="tab-content border border-primary">
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
                id="editmap"
                role="tabpanel"
                aria-labelledby="edit-map-tab"
              >
                {this.editMapTab(t)}
              </div>
            </div>
          </nav>
        </div>
        <div className="col-12">
          <MapLayer
            key={this.props.map.mapid}
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

export default withTranslation()(ResourceMap);
