"use client";

import type React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto">
      <div className="bg-gray-800 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center space-x-2">
            <span>By Dm94Dani</span>
            <span>|</span>
            <Link className="text-white hover:text-gray-300" href="/privacy">
              {t("common.privacyPolicy")}
            </Link>
            <span>|</span>
            <a
              title="GitHub package.json version"
              href="https://github.com/dm94/stiletto-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                width="104"
                height="20"
                alt="GitHub package.json version"
                src="https://img.shields.io/github/package-json/v/dm94/stiletto-web"
              />
            </a>
            <span>|</span>
            <a
              title="GitHub last commit"
              href="https://github.com/dm94/stiletto-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                height="20"
                alt="GitHub last commit"
                src="https://img.shields.io/github/last-commit/dm94/stiletto-web"
              />
            </a>
            <span>|</span>
            <a
              title="Crowdin"
              target="_blank"
              rel="noopener noreferrer"
              href="https://crowdin.com/project/stiletto"
              className="inline-block"
            >
              <img
                width="94"
                height="20"
                alt="Crowdin translations"
                src="https://badges.crowdin.net/stiletto/localized.svg"
              />
            </a>
            <span>|</span>
            <span className="flex items-center">
              {t("about.disclaimer")}{" "}
              <a
                href="https://www.donkey.team/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 ml-1"
              >
                Donkey Crew
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
