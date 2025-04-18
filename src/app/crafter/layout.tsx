import type React from "react";
import { type ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import { getDomain } from "@functions/utils";
import LoadingScreen from "@components/LoadingScreen";

export const metadata: Metadata = {
  title: "Last Oasis Crafting Calculator - Stiletto for Last Oasis",
  description: "See the materials needed to build each thing",
  twitter: {
    card: "summary_large_image",
    title: "Crafter - Stiletto for Last Oasis",
    description: "See the materials needed to build each thing",
    images: [
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg",
    ],
  },
  alternates: {
    canonical: `${getDomain()}/crafter`,
  },
};

export default function CrafterLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col lg:flex-row">
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
    </div>
  );
}
