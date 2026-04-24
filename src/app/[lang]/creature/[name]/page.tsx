import CreatureWiki from "@pages/CreatureWiki";
import { supportedLanguages } from "@config/languages";
import { toSlug } from "@functions/utils";
import fs from 'node:fs';
import path from 'node:path';

// Helper to get creatures directly from FS during build
async function getCreaturesLocal() {
  const filePath = path.join(process.cwd(), 'public/json/creatures_min.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}

export async function generateStaticParams() {
  const creatures = await getCreaturesLocal();
  const langs = supportedLanguages.map(l => l.key);

  const params = [];
  for (const creature of creatures) {
    for (const lang of langs) {
      params.push({
        lang,
        name: toSlug(creature.name)
      });
    }
  }
  return params;
}

export default function CreaturePage() {
  return <CreatureWiki />;
}
