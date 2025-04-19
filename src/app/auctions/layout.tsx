import type React from "react";
import { type ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import LoadingScreen from "@components/LoadingScreen";

export const metadata: Metadata = {
  title: "Auction Timers - Stiletto for Last Oasis",
  description: "Timers for what you need",
  twitter: {
    card: "summary_large_image",
    title: "Auction Timers - Stiletto for Last Oasis",
    description: "Timers for what you need",
    images: [
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/timers.jpg",
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
