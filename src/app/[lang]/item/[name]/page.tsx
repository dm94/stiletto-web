import { Rarity } from "@ctypes/item";
import { redirect } from "next/navigation";

export const revalidate = 86400;

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; name: string }>;
}) {
  const resolvedParams = await params;
  redirect(`/${resolvedParams.lang}/item/${resolvedParams.name}/${Rarity.Common}`);
}
