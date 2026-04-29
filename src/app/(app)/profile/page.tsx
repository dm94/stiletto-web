"use client";

import dynamic from "next/dynamic";

const DiscordConnection = dynamic(() => import("@pages/DiscordConnection"), { ssr: false });

export default function Page() {
  return <DiscordConnection />;
}
