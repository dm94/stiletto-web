import { useTranslations } from "next-intl";
import Link from "next/link";
import { getStoredItem } from "@/lib/storage";
import type { Metadata } from "next";
import Others from "@/components/Others";

export const metadata: Metadata = {
  title: "Stiletto for the Last Oasis",
  description:
    "Stiletto the page with utilities for the game Last Oasis. Crafting calculator, Resources map, Quality calculator, Clan management and more...",
  themeColor: "#FFFFFF",
  openGraph: {
    title: "Stiletto for Last Oasis",
    description: "Stiletto the page with utilities for the game Last Oasis",
    images: [
      {
        url: "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg",
        width: 800,
        height: 600,
        alt: "Stiletto Crafting Calculator Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stiletto for Last Oasis",
    description: "Stiletto the page with utilities for the game Last Oasis",
    images: [
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg",
    ],
  },
};

export default function Home() {
  const t = useTranslations();

  const features = [
    {
      title: "Crafting Calculator",
      description:
        "Here you can see and automatically calculate the materials needed to build each item",
      href: "/crafter",
    },
    {
      title: "Trading System",
      description:
        "You can create offers or search for them easily from here, you don't need to be on 20 discord servers looking for who to exchange with",
      href: "/trades",
    },
    {
      title: "Resource Maps",
      description: "Create and edit maps to add resources or strategic points",
      href: getStoredItem("discordid") ? "/maps" : "/map",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            aria-label={t(feature.title)}
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
              {t(feature.title)}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t(feature.description)}
            </p>
          </Link>
        ))}
      </div>

      <Others />
    </div>
  );
}
