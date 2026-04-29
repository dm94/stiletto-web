"use client";

import dynamic from "next/dynamic";

const ItemWiki = dynamic(() => import("@pages/ItemWiki"), { ssr: false });

export default function Page() {
  return <ItemWiki />;
}
