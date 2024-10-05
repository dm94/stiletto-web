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
    const markers = await getClusters();
    this.setState({ clusters: markers });
  }

  clusterList() {
    if (this.state.clusters != null) {
      return this.state.clusters.map((cl) => (
        <option
          key={`${cl.region}-${cl.name}`}
          value={`${cl.region}-${cl.name}`}
        >
          {`${[cl.region]} ${cl.name} (${cl.clan_limit})`}
        </option>
      ));
    }
  }

  render() {
    return (
      <select
        id="regionInput"
        className="custom-select"
        value={this.props?.value ? this.props?.value : ""}
        onChange={(evt) => this.props?.onChange(evt.target.value)}
      >
        {this.props?.filter && <option value="All">All</option>}
        {this.clusterList()}
      </select>
    );
  }
}

export default ClusterList;
