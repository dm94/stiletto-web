import ClientOnly from "./client";

export function generateStaticParams() {
  return [
    { slug: [""] },
    { slug: ["profile"] },
    { slug: ["crafter"] },
    { slug: ["members"] },
    { slug: ["clanlist"] },
    { slug: ["maps"] },
    { slug: ["maps", "1"] },
    { slug: ["trades"] },
    { slug: ["diplomacy"] },
    { slug: ["auctions"] },
    { slug: ["others"] },
    { slug: ["map"] },
    { slug: ["map", "1"] },
    { slug: ["tech"] },
    { slug: ["tech", "tree"] },
    { slug: ["privacy"] },
    { slug: ["item"] },
    { slug: ["item", "example"] },
    { slug: ["creature"] },
    { slug: ["creature", "example"] },
    { slug: ["wiki"] },
    { slug: ["not-found"] },
  ];
}

export default function Page() {
  return <ClientOnly />;
}
