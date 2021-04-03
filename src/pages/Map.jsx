import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import CreateMapNoLog from "../components/CreateMapNoLog";
import ResourceMapNoLog from "../components/ResourceMapNoLog";
const queryString = require("query-string");

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapId: null,
      pass: null,
    };
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({
      mapId: parsed.mapid,
      pass: parsed.pass,
    });
  }

  render() {
    if (this.state.mapId != null && this.state.pass != null) {
      return (
        <ResourceMapNoLog mapId={this.state.mapId} pass={this.state.pass} />
      );
    } else if (localStorage.getItem("discordid") != null) {
      return <Redirect to="/maps" />;
    } else {
      return (
        <CreateMapNoLog
          onOpen={(id, pass) => {
            this.setState({ mapId: id, pass: pass });
          }}
        />
      );
    }
  }
}

export default Map;
