"use client";

import type { ReactNode } from "react";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import type { Dictionary } from "../../../lib/i18n";

interface ClientLayoutProps {
  children: ReactNode;
  dictionary: Dictionary;
  locale: string;
}

export default function ClientLayout({
  children,
  dictionary,
  locale,
}: ClientLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Stiletto</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>{dictionary.menu?.crafter || "Crafter"}</li>
              <li>{dictionary.menu?.wiki || "Wiki"}</li>
              <li>{dictionary.menu?.techTree || "Tech Tree"}</li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">{children}</main>

      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <LanguageSwitcher dictionary={dictionary} currentLocale={locale} />
        </div>
      </footer>
    </div>
  );
}
