"use client";

import dynamic from "next/dynamic";

const Diplomacy = dynamic(() => import("@pages/Diplomacy"), { ssr: false });

export default function Page() {
  return <Diplomacy />;
}
