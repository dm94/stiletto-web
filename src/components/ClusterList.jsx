import React, { useState, useEffect } from "react";
import { getClusters } from "../functions/services";

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
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    >
      {filter && <option value="All">All</option>}
      {renderClusterOptions()}
    </select>
  );
};

export default ClusterList;
