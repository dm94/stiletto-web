"use client";

import dynamic from "next/dynamic";

const Wiki = dynamic(() => import("@pages/Wiki"), { ssr: false });

export default function Page() {
  return <Wiki />;
}
