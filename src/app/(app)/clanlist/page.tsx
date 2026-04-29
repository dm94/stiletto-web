"use client";

import dynamic from "next/dynamic";

const ClanList = dynamic(() => import("@pages/ClanList"), { ssr: false });

export default function Page() {
  return <ClanList />;
}
