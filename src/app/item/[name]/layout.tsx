import type React from "react";
import { type ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import LoadingScreen from "@components/LoadingScreen";
import { getItemDecodedName, getItemUrl } from "@functions/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { name } = resolvedParams;

  const itemName = getItemDecodedName(name);

  return {
    title: `${itemName} - Stiletto for Last Oasis`,
    description: `All information for ${itemName}`,
    alternates: {
      canonical: getItemUrl(itemName),
    },
  };
}

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
