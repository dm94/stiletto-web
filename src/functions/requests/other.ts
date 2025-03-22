import { objectToURLSearchParams } from "../utils";

export const getExternalWikiDescription = async (
  name: string,
): Promise<string> => {
  const params = objectToURLSearchParams({
    action: "query",
    prop: "extracts",
    titles: name,
    exsentences: 10,
    format: "json",
    origin: "*",
    formatversion: 2,
    exlimit: 1,
    explaintext: 1,
  });

  const url = `https://lastoasis.fandom.com/api.php?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    const page = data?.query?.pages?.[0];
    if (page?.extract) {
      return page.extract;
    }
  }

  throw new Error("errors.apiConnection");
};
