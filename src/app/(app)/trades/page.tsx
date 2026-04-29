"use client";

import dynamic from "next/dynamic";

const TradeSystem = dynamic(() => import("@pages/TradeSystem"), { ssr: false });

export default function Page() {
  return <TradeSystem />;
}
