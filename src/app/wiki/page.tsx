import Wiki from "@pages/Wiki";
import { readJsonFile } from "../../lib/wikiData";
import type { Item } from "@ctypes/item";
import type { Creature } from "@ctypes/creature";
import type { Perk } from "@ctypes/perk";

export const dynamic = "force-static";

export default async function Page() {
  const [items, creatures, perks] = await Promise.all([
    readJsonFile<Item[]>("public/json/items_min.json"),
    readJsonFile<Creature[]>("public/json/creatures_min.json"),
    readJsonFile<Perk[]>("public/json/perks_min.json"),
  ]);

  return <Wiki initialItems={items} initialCreatures={creatures} initialPerks={perks} />;
}
