import type React from "react";
import { type ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import LoadingScreen from "@components/LoadingScreen";

export const metadata: Metadata = {
  title: "Item Wiki - Stiletto for Last Oasis",
  description: "Information about items in Last Oasis",
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
