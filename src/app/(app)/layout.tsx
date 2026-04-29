"use client";

import dynamic from "next/dynamic";

const AppShell = dynamic(() => import("@components/AppShell"), { ssr: false });

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
