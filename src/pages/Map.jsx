import React, { Component } from "react";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import MapLayer from "../components/MapLayer";
import ResourcesInMapList from "../components/ResourcesInMapList";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import CreateResourceTab from "../components/CreateResourceTab";
const axios = require("axios");
const queryString = require("query-string");

class Map extends Component {
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
    };
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.mapid != null && parsed.pass != null) {
      axios
        .get(
          "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/markers.json"
        )
        .then((response) => {
          this.setState({ items: response.data });
        });

      this.setState({
        mapId: parsed.mapid,
        pass: parsed.pass,
      });

      axios
        .get(process.env.REACT_APP_API_URL + "/maps.php", {
          params: {
            mapid: parsed.mapid,
            pass: parsed.pass,
            accion: "getresourcesnolog",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.setState({ resourcesInTheMap: response.data });
          }
        });
    }
  }

  deleteResource = (resourceid, resourcetoken) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/maps.php", {
        params: {
          accion: "deleteresourcenolog",
          mapid: this.state.mapId,
          pass: this.state.pass,
          dataupdate: resourceid,
          resourcetoken: resourcetoken,
        },
      })
      .then((response) => {
        if (response.status === 202) {
          this.componentDidMount();
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  };

  createResource = (resourceTypeInput, qualityInput) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/maps.php", {
        params: {
          mapid: this.state.mapId,
          pass: this.state.pass,
          accion: "addresourcemapnolog",
          resourcetype: resourceTypeInput,
          quality: qualityInput,
          x: this.state.coordinateXInput,
          y: this.state.coordinateYInput,
        },
      })
      .then((response) => {
        this.setState({
          coordinateXInput: 0,
          coordinateYInput: 0,
        });
        if (response.status === 202) {
          this.componentDidMount();
        }
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
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
    if (this.state.mapId != null && this.state.pass != null) {
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
            <nav
              className="collapse show"
              id="items-nav"
              aria-label="Items Navs"
            >
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
              resourcesInTheMap={this.state.resourcesInTheMap}
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
    } else {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: t("You need a link with more data to access here"),
            redirectPage: "/",
          }}
        />
      );
    }
  }
}

export default withTranslation()(Map);
