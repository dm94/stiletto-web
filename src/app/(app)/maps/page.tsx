"use client";

import dynamic from "next/dynamic";

const ClanMaps = dynamic(() => import("@pages/ClanMaps"), { ssr: false });

export default function Page() {
  return <ClanMaps />;
}
