"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("../../CrafterApp"), { ssr: false });

export default function ClientOnly() {
  return <App />;
}
