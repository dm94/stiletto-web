import React, { Component } from "react";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import MapLayer from "../components/MapLayer";
import { withTranslation } from "react-i18next";
const axios = require("axios");
const queryString = require("query-string");

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapName: null,
      resourcesInTheMap: null,
      mapId: null,
      pass: null,
      isLoaded: false,
    };
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.mapid != null && parsed.pass != null && parsed.mapname != null) {
      this.setState({
        mapId: parsed.mapid,
        pass: parsed.pass,
        mapName: parsed.mapname,
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

  deleteResource = (resourceid) => {
    console.log("This function is not available from here");
  };

  changeCoords = (x, y) => {
    console.log("X: " + x + " | Y: " + y);
  };

  render() {
    const { t } = this.props;
    if (this.state.isLoaded) {
      return <LoadingScreen />;
    }

    if (this.state.mapId != null && this.state.pass != null) {
      return (
        <div className="row flex-xl-nowrap">
          <div className="col-xl-12">
            <MapLayer
              key={this.state.mapId}
              resourcesInTheMap={this.state.resourcesInTheMap}
              deleteResource={this.deleteResource}
              changeInput={this.changeCoords}
              mapName={this.state.mapName}
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
