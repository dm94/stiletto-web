import { config } from "@config/config";
import type { ClusterInfo } from "@ctypes/dto/clusters";

export const getClusters = async (): Promise<ClusterInfo[]> => {
  const response = await fetch(`${config.REACT_APP_API_URL}/clusters`, {
    method: "GET",
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
