"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="mt-auto py-3 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex-1 flex flex-wrap items-center gap-2">
            <span>By Dm94Dani</span>
            <span>|</span>
            <Link href="/privacy" className="text-white hover:text-gray-300">
              {t("Privacy Policy")}
            </Link>
            <span>|</span>
            <a
              href="https://github.com/dm94/stiletto-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <img
                width={104}
                height={20}
                alt="GitHub package.json version"
                src="https://img.shields.io/github/package-json/v/dm94/stiletto-web"
              />
            </a>
            <span>|</span>
            <a
              href="https://github.com/dm94/stiletto-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <img
                width={104}
                height={20}
                alt="GitHub last commit"
                src="https://img.shields.io/github/last-commit/dm94/stiletto-web"
              />
            </a>
            <span>|</span>
            <a
              href="https://crowdin.com/project/stiletto"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <img
                width={94}
                height={20}
                alt="Crowdin translations"
                src="https://badges.crowdin.net/stiletto/localized.svg"
              />
            </a>
            <span>|</span>
            <span className="flex-1">
              {t(
                "This website uses utilities related to the game 'Last Oasis' but is not affiliated with"
              )}{" "}
              <a
                href="https://www.donkey.team/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                Donkey Crew
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
