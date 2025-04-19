import { Suspense } from "react";
import dynamic from "next/dynamic";

const HomeLinks = dynamic(() => import("@components/HomeLinks"));
const HomeOthers = dynamic(() => import("@components/HomeOthers"));

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Suspense
        fallback={<div className="animate-pulse h-32 bg-gray-700 rounded-lg" />}
      >
        <HomeLinks />
      </Suspense>
      <Suspense
        fallback={<div className="animate-pulse h-64 bg-gray-700 rounded-lg" />}
      >
        <HomeOthers />
      </Suspense>
    </div>
  );
}
