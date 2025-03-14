"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Metadata } from "next";
import CreateMapNoLog from "@/components/ClanMaps/CreateMapNoLog";
import ResourceMapNoLog from "@/components/ClanMaps/ResourceMapNoLog";

export const metadata: Metadata = {
  title: "Interactive Resource Map - Stiletto for Last Oasis",
  description: "Interactive Map of resources shared through a link",
  openGraph: {
    images: [
      {
        url: "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg",
        width: 800,
        height: 600,
        alt: "Interactive Resource Map Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg",
    ],
  },
};

export default function Map() {
  const [mapId, setMapId] = useState<string | null>(null);
  const [pass, setPass] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    setMapId(searchParams.get("mapid"));
    setPass(searchParams.get("pass"));
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      {mapId && pass ? (
        <ResourceMapNoLog mapId={mapId} pass={pass} />
      ) : (
        <CreateMapNoLog
          onOpen={(id: string, p: string) => {
            setMapId(id);
            setPass(p);
          }}
        />
      )}
    </div>
  );
}
