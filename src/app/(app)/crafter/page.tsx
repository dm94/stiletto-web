"use client";

import dynamic from "next/dynamic";

const Crafter = dynamic(() => import("@pages/Crafter"), { ssr: false });

export default function Page() {
  return <Crafter />;
}
