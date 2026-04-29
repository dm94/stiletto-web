"use client";

import dynamic from "next/dynamic";

const WalkerList = dynamic(() => import("@pages/WalkerList"), { ssr: false });

export default function Page() {
  return <WalkerList />;
}
