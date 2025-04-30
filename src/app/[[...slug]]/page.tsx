"use client";

import dynamic from "next/dynamic";
import "../../index.css";

const App = dynamic(() => import("../../CrafterApp"), { ssr: false });

export default function Page() {
  return <App />;
}
