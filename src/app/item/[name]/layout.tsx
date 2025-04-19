import type React from "react";
import { type ReactNode, Suspense } from "react";
import LoadingScreen from "@components/LoadingScreen";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
