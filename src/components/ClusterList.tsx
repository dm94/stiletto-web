import type React from "react";
import { useState, useEffect } from "react";
import { getClusters } from "../functions/services";

interface Cluster {
  region: string;
  name: string;
  clan_limit: number;
}

interface ClusterListProps {
  value?: string;
  onChange?: (value: string) => void;
  filter?: boolean;
}

const ClusterList: React.FC<ClusterListProps> = ({
  value = "",
  onChange,
  filter,
}) => {
  const [clusters, setClusters] = useState<Cluster[]>([]);

  useEffect(() => {
    const fetchClusters = async () => {
      const data = await getClusters();
      setClusters(data || []);
    };
    fetchClusters();
  }, []);

  const renderClusterOptions = () => {
    if (!clusters.length) {
      return null;
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
