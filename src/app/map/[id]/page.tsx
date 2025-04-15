"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import ResourceMapNoLog from "@components/ClanMaps/ResourceMapNoLog";

export default function ResourceMapPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const pass = searchParams?.get("pass");

  return (
    <>
      {id && pass ? <ResourceMapNoLog mapId={Number(id)} pass={pass} /> : null}
    </>
  );
}
