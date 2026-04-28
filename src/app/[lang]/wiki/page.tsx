import Wiki from "@pages/Wiki";
import { supportedLanguages } from "@config/languages";
import { getCreaturesMin, getItemsMin, getPerksMin, getWikiBuildTimestamp } from "@lib/wikiStatic";

export const dynamic = "force-static";

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang: lang.key }));
}

export default async function Page() {
  const [items, creatures, perks] = await Promise.all([
    getItemsMin(),
    getCreaturesMin(),
    getPerksMin(),
  ]);

  return (
    <Wiki
      initialItems={items}
      initialCreatures={creatures}
      initialPerks={perks}
      initialWikiLastUpdate={getWikiBuildTimestamp()}
    />
  );
}

