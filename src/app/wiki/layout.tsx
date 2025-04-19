import type React from "react";
import { type ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import LoadingScreen from "@components/LoadingScreen";

export const metadata: Metadata = {
  title: "Wiki - Stiletto for Last Oasis",
  description: "Information about items, creatures, and other game elements",
  twitter: {
    card: "summary_large_image",
    title: "Wiki - Stiletto for Last Oasis",
    description: "Information about items, creatures, and other game elements",
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
