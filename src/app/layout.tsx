import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "@components/AppShell";

export const metadata: Metadata = {
  title: "Stiletto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
