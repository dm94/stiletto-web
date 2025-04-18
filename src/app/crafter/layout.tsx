import type React from "react";
import { type ReactNode, Suspense } from "react";
import Head from "next/head";
import { getDomain } from "@functions/utils";
import LoadingScreen from "@components/LoadingScreen";

export default function CrafterLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Head>
        <title>Last Oasis Crafting Calculator - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="See the materials needed to build each thing"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Crafter - Stiletto for Last Oasis"
        />
        <meta
          name="twitter:description"
          content="See the materials needed to build each thing"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/crafter`} />
      </Head>
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
    </>
  );
}
