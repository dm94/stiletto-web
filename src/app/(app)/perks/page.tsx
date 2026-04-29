"use client";

import dynamic from "next/dynamic";

const PerkCostCalculator = dynamic(() => import("@pages/PerkCostCalculator"), { ssr: false });

export default function Page() {
  return <PerkCostCalculator />;
}
