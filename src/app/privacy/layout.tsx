import type React from "react";
import { type ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import LoadingScreen from "@components/LoadingScreen";

export const metadata: Metadata = {
  title: "Privacy Policy - Stiletto for Last Oasis",
  description: "Privacy Policy",
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
