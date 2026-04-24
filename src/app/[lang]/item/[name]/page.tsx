import ItemWiki from "@pages/ItemWiki";
import { supportedLanguages } from "@config/languages";
import fs from 'node:fs';
import path from 'node:path';

// Helper to get items directly from FS during build
async function getItemsLocal() {
  const filePath = path.join(process.cwd(), 'public/json/items_min.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}

export async function generateStaticParams() {
  const items = await getItemsLocal();
  const langs = supportedLanguages.map(l => l.key);

  const params = [];
  for (const item of items) {
    for (const lang of langs) {
      params.push({
        lang,
        name: item.name.toLowerCase().replace(/ /g, "-")
      });
    }
  }
  return params;
}

export default function ItemPage() {
  return <ItemWiki />;
}
