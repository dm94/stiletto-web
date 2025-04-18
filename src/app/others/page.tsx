"use client";

import type React from "react";
import { useTranslation } from "next-i18next";
import { memo } from "react";

const Others: React.FC = () => {
  const { t } = useTranslation();

  const showDiscord = () => {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 mb-4">
        <div className="p-4">
          <a
            className="w-full block px-4 py-2 bg-green-500 text-white text-center rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            href="https://discord.deeme.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("discord.dm94DaniDiscord")}
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 mb-4">
              <div className="p-4">
                <a
                  className="w-full block px-4 py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  href="https://store.steampowered.com/app/903950/Last_Oasis/?curator_clanid=9919055"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("common.steamPage")}
                </a>
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 mb-4">
              <div className="p-4">
                <a
                  className="w-full block px-4 py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  href="https://discord.gg/lastoasis"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("common.officialDiscord")}
                </a>
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600">
                <div className="p-4">
                  <a
                    className="w-full block px-4 py-2 bg-green-500 text-white text-center rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    href="https://ko-fi.com/deeme"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("common.helpKeepWebsiteRunning")}
                  </a>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600">
                <div className="p-4">
                  <a
                    className="w-full block px-4 py-2 bg-red-500 text-white text-center rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    href="https://crowdin.com/project/stiletto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("about.helpTranslate")}
                  </a>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600">
                <div className="p-4 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">
                    {t("discord.bot")}
                  </h3>
                  <p className="mb-4 text-gray-300">
                    {t("discord.botDescription")}
                  </p>
                  <a
                    className="inline-block px-4 py-2 bg-green-500 text-white text-center rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    href="https://top.gg/bot/715948052979908911"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("discord.goToDiscordBot")}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-1">{showDiscord()}</div>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-blue-500 mb-4">
            {t("common.sponsoredServers")}
          </h3>
          <div className="max-w-md mx-auto p-4">
            <a
              href="https://discord.gg/FcecRtZ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="w-full h-auto rounded-lg"
                src="/img/banner-lastoasis.jpg"
                alt={t("common.steamPage")}
                height="100"
                width="600"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Others);
