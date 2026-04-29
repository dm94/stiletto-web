"use client";

import dynamic from "next/dynamic";

const MemberList = dynamic(() => import("@pages/MemberList"), { ssr: false });

export default function Page() {
  return <MemberList />;
}
