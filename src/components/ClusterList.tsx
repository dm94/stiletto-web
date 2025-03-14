'use client';

import { useState, useEffect } from 'react';
import { getClusters } from '@/lib/services';

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

export default function ClusterList({
  value = '',
  onChange,
  filter,
}: ClusterListProps) {
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
      className="custom-select"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    >
      {filter && <option value="All">All</option>}
      {renderClusterOptions()}
    </select>
  );
} 