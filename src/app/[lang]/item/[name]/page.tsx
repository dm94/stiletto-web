import { supportedLanguages } from "@config/languages";
import { getItemsMin, getCodedNameFromDisplayName } from "@lib/wikiStatic";
import { Rarity } from "@ctypes/item";
import { redirect } from "next/navigation";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const items = await getItemsMin();
  const codedNames = items.map((item) => getCodedNameFromDisplayName(item.name));

  const params: Array<{ lang: string; name: string }> = [];
  for (const lang of supportedLanguages) {
    for (const name of codedNames) {
      params.push({ lang: lang.key, name });
    }
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; name: string }>;
}) {
  const resolvedParams = await params;
  redirect(`/${resolvedParams.lang}/item/${resolvedParams.name}/${Rarity.Common}`);
}
