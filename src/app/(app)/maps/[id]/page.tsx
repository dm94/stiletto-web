"use client";

import dynamic from "next/dynamic";

const MapDetail = dynamic(() => import("@pages/MapDetail"), { ssr: false });

export default function Page() {
  return <MapDetail />;
}
