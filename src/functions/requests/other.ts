import { objectToURLSearchParams } from "../utils";

export const getExternalWikiDescription = async (name: string) => {
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

  try {
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
  } catch (error) {
    console.log("No description found in the wiki", error);
  }
};
