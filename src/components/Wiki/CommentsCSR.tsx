"use client";

import dynamic from "next/dynamic";

const Comments = dynamic(() => import("./Comments"), { ssr: false });

export default function CommentsCSR({ name }: { name: string }) {
  return <Comments name={name} />;
}

