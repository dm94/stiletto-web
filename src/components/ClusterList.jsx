import React, { Component } from "react";
import { getClusters } from "../services";

class ClusterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clusters: null,
    };
  }

  async componentDidMount() {
    let markers = await getClusters();
    this.setState({ clusters: markers });
  }

  render() {
    if (this.state.clusters != null) {
      return this.state.clusters.map((cl) => (
        <option
          key={cl.region + "-" + cl.name}
          value={cl.region + "-" + cl.name}
        >
          {[cl.region] + " " + cl.name + " (" + cl.clan_limit + ")"}
        </option>
      ));
    } else {
      return "";
    }
  }
}

export default ClusterList;
