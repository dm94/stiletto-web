import type {
  SeeWhoHasLearntItRequestParams,
  TechUserInfo,
} from "@ctypes/dto/tech";
import { objectToURLSearchParams } from "../../utils";
import { config } from "@config/config";
import { getStoredItem } from "../../services";

export const seeWhoHasLearntIt = async (
  clanid: string,
  requestParams: SeeWhoHasLearntItRequestParams,
): Promise<TechUserInfo[]> => {
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(
    `${config.REACT_APP_API_URL}/clans/${clanid}/tech?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    },
  );

  if (response) {
    return await response.json();
  }

  throw new Error("errors.apiConnection");
};
