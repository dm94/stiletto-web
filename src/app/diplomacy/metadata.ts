import { getDomain } from "@functions/utils";

export const metadata = {
  title: "Clan Diplomacy - Stiletto for Last Oasis",
  description: "View your clan's list of allies, enemies and NAP",
  openGraph: {
    title: "Clan Diplomacy - Stiletto for Last Oasis",
    description: "View your clan's list of allies, enemies and NAP",
    images: [
      {
        url: "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clan Diplomacy - Stiletto for Last Oasis",
    description: "View your clan's list of allies, enemies and NAP",
    images: [
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg",
    ],
  },
  alternates: {
    canonical: `${getDomain()}/diplomacy`,
  },
};

export default metadata;
