import type {
  SeeWhoHasLearntItRequestParams,
  TechUserInfo,
} from "../../../types/dto/tech";
import { objectToURLSearchParams } from "../../utils";
import { config } from "../../../config/config";
import { getStoredItem } from "../../services";

export const seeWhoHasLearntIt = async (
  clanid: string,
  requestParams: SeeWhoHasLearntItRequestParams,
): Promise<TechUserInfo[]> => {
  const params = objectToURLSearchParams(requestParams);

  const response = await fetch(
    `${config.API_URL}/clans/${clanid}/tech?${params}`,
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
