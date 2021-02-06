import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import MapLayer from "../components/MapLayer";
import ResourcesInMapList from "../components/ResourcesInMapList";
import CreateResourceTab from "../components/CreateResourceTab";

import { Helmet } from "react-helmet";
import Axios from "axios";

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
    };
  }
  componentDidMount() {
    if (this.props.mapId != null && this.props.pass != null) {
      Axios.get(
        "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/markers.json"
      ).then((response) => {
        this.setState({ items: response.data });
      });

      this.setState({
        mapId: this.props.mapId,
        pass: this.props.pass,
      });

      Axios.get(
        process.env.REACT_APP_API_URL +
          "/maps/" +
          this.props.mapId +
          "/resources",
        {
          params: {
            discordid: localStorage.getItem("discordid"),
            token: localStorage.getItem("token"),
            mappass: this.props.pass,
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
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  createResource = (resourceTypeInput, qualityInput, descriptionInput) => {
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
      .catch((error) => {
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
            text: t(this.state.textMessage),
            redirectPage: null,
          }}
          onClickOk={() => this.setState({ textMessage: null })}
        />
      );
    }
    return (
      <div className="row flex-xl-nowrap">
        <Helmet>
          <title>Map - Stiletto</title>
          <meta
            name="description"
            content="Map of resources shared through a link"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@dm94dani" />
          <meta name="twitter:title" content="Map - Stiletto" />
          <meta
            name="twitter:description"
            content="Map of resources shared through a link"
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg"
          />
        </Helmet>
        <div className="col-xl-3 col-sm-12">
          <div className="bd-search d-flex align-items-center">
            <button
              className="btn d-md-none p-0 ml-3"
              type="button"
              data-toggle="collapse"
              data-target="#items-nav"
              aria-controls="items-nav"
              aria-expanded="false"
              aria-label="Toggle items"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                role="img"
                focusable="false"
              >
                <title>{t("Menu")}</title>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M4 7h22M4 15h22M4 23h22"
                ></path>
              </svg>
            </button>
          </div>
          <nav className="collapse show" id="items-nav" aria-label="Items Navs">
            <ul className="nav nav-tabs" role="tablist">
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
                  this.state.resourcesInTheMap != null &&
                  this.state.resourcesInTheMap[0] != null &&
                  this.state.resourcesInTheMap[0].allowedit != null &&
                  this.state.resourcesInTheMap[0].allowedit === 1
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
            <div className="tab-content">
              <div
                className="tab-pane fade show active"
                id="resourcelist"
                role="tabpanel"
                aria-labelledby="resource-list-tab"
              >
                <ul
                  className="list-group overflow-auto"
                  style={{ height: "100vh" }}
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
        <div className="col-xl-9">
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
