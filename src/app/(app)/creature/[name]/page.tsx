"use client";

import dynamic from "next/dynamic";

const CreatureWiki = dynamic(() => import("@pages/CreatureWiki"), { ssr: false });

export default function Page() {
  return <CreatureWiki />;
}
