import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Map List - Stiletto for Last Oasis",
  description:
    "Create, edit and share game maps by adding markers to them, e.g. to show where there is quality material or an enemy base.",
  twitter: {
    card: "summary_large_image",
    title: "Map List - Stiletto for Last Oasis",
    description:
      "Create, edit and share game maps by adding markers to them, e.g. to show where there is quality material or an enemy base.",
    images: [
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/maps.jpg",
    ],
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
