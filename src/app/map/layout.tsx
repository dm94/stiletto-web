import type React from "react";
import { type ReactNode, Suspense } from "react";

import LoadingScreen from "@components/LoadingScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Resource Map - Stiletto for Last Oasis",
  description: "Interactive Map of resources shared through a link",
  twitter: {
    card: "summary_large_image",
    title: "Interactive Resource Map - Stiletto for Last Oasis",
    description: "Interactive Map of resources shared through a link",
    images: [
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg",
    ],
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
