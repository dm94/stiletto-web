import { config } from "@config/config";
import type { GenericResponse } from "@ctypes/dto/generic";
import type { ReportIncidentRequest } from "@ctypes/dto/reports";

export const reportIncident = async (
  requestParams: ReportIncidentRequest,
): Promise<GenericResponse> => {
  const response = await fetch(`${config.API_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestParams),
  });

  if (response?.ok) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
