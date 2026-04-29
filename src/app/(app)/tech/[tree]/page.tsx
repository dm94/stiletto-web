"use client";

import dynamic from "next/dynamic";

const TechTree = dynamic(() => import("@pages/TechTree"), { ssr: false });

export default function Page() {
  return <TechTree />;
}
