import React, { useState, useEffect } from "react";
import { getClusters } from "../services";

const ClusterList = ({ value = "", onChange, filter }) => {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    const fetchClusters = async () => {
      const data = await getClusters();
      setClusters(data || []);
    };
    fetchClusters();
  }, []);

  const renderClusterOptions = () => {
    if (!clusters.length) {
      return "";
    }

    return clusters.map((cluster) => (
      <option
        key={`${cluster.region}-${cluster.name}`}
        value={`${cluster.region}-${cluster.name}`}
      >
        {`${[cluster.region]} ${cluster.name} (${cluster.clan_limit})`}
      </option>
    ));
  };

  return (
    <select
      id="regionInput"
      className="custom-select"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    >
      {filter && <option value="All">All</option>}
      {renderClusterOptions()}
    </select>
  );
};

export default ClusterList;
