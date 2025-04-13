import { getDictionary, locales } from "../../lib/i18n";
import type { Metadata } from "next";

// This function is required for static export with dynamic route segments
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "Stiletto for Last Oasis - Home",
  };
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const dictionary = await getDictionary(locale);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">
        {dictionary.menu?.crafter || "Crafter"}
      </h1>
      <p className="text-lg mb-6">
        {dictionary.about?.githubProject || "Github project"}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            {dictionary.menu?.crafting || "Crafting"}
          </h2>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            {dictionary.menu?.wiki || "Wiki"}
          </h2>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            {dictionary.menu?.techTree || "Tech Tree"}
          </h2>
        </div>
      </div>
    </main>
  );
}
