"use client";

import dynamic from "next/dynamic";

const AuctionTimers = dynamic(() => import("@pages/AuctionTimers"), { ssr: false });

export default function Page() {
  return <AuctionTimers />;
}
