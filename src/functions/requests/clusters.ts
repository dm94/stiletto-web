import { config } from "../../config/clientConfig";
import type { ClusterInfo } from "../../types/dto/clusters";

export const getClusters = async (): Promise<ClusterInfo[]> => {
  const response = await fetch(`${config.API_URL}/clusters`, {
    method: "GET",
  });

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
