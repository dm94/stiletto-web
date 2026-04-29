import { supportedLanguages } from "@config/languages";
import type { Creature } from "@ctypes/creature";
import type { Item } from "@ctypes/item";
import type { Perk } from "@ctypes/perk";
import { getCodedNameFromDisplayName, getCreaturesMin, getItemsMin, getPerksMin } from "@lib/wikiStatic";
import { createTranslator } from "@lib/serverTranslations";

export const dynamic = "force-static";

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang: lang.key }));
}

function sortByName<T extends { name: string }>(a: T, b: T) {
  return a.name.localeCompare(b.name);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await createTranslator(lang);

  const [items, creatures, perks] = await Promise.all([
    getItemsMin(),
    getCreaturesMin(),
    getPerksMin(),
  ]);

  const renderItem = (item: Item) => {
    const coded = getCodedNameFromDisplayName(item.name);
    return (
      <li key={coded}>
        <a href={`/${lang}/item/${coded}/common`}>
          {t(item.name, { ns: "items", defaultValue: item.name })}
        </a>
      </li>
    );
  };

  const renderCreature = (creature: Creature) => {
    const coded = getCodedNameFromDisplayName(creature.name);
    return (
      <li key={coded}>
        <a href={`/${lang}/creature/${coded}`}>{creature.name}</a>
      </li>
    );
  };

  const renderPerk = (perk: Perk) => (
    <li key={perk.name}>{perk.name}</li>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-200 mb-6">
        {t("menu.wiki", { defaultValue: "Wiki" })}
      </h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-200 mb-3">
          {t("seo.wiki.items", { defaultValue: "Items" })}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-blue-400">
          {items.slice().sort(sortByName).map(renderItem)}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-200 mb-3">
          {t("seo.wiki.creatures", { defaultValue: "Creatures" })}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-blue-400">
          {creatures.slice().sort(sortByName).map(renderCreature)}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-200 mb-3">
          {t("seo.wiki.perks", { defaultValue: "Perks" })}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-gray-300">
          {perks.slice().sort(sortByName).map(renderPerk)}
        </ul>
      </section>
    </main>
  );
}
