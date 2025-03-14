"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { getStoredItem } from "@/lib/storage";

export const Others = () => {
  const t = useTranslations();

  const showDiscord = () => {
    if (getStoredItem("acceptscookies")) {
      return (
        <iframe
          title="discord"
          src="https://discord.com/widget?id=317737508064591874&theme=dark"
          className="w-full"
          height={500}
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />
      );
    }

    return (
      <div className="card mb-3">
        <div className="card-body">
          <a
            className="btn btn-success w-full"
            href="https://discord.deeme.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Dm94Dani´s Discord")}
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-6xl mx-auto">
      <div className="md:col-span-4">
        <div className="card mb-3">
          <div className="card-body">
            <a
              className="btn btn-primary w-full"
              href="https://store.steampowered.com/app/903950/Last_Oasis/?curator_clanid=9919055"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Steam Page")}
            </a>
          </div>
        </div>
      </div>
      <div className="md:col-span-4">
        <div className="card mb-3">
          <div className="card-body">
            <a
              className="btn btn-primary w-full"
              href="https://discord.gg/lastoasis"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Official Discord")}
            </a>
          </div>
        </div>
      </div>
      <div className="md:col-span-6">
        <div className="space-y-4">
          <div className="card mb-3">
            <div className="card-body">
              <a
                className="btn btn-success w-full"
                href="https://ko-fi.com/deeme"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Help keep the website running")}
              </a>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <a
                className="btn btn-danger w-full"
                href="https://crowdin.com/project/stiletto"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Help to translate the website")}
              </a>
            </div>
          </div>
          <div className="border rounded overflow-hidden mb-4">
            <div className="p-4 flex flex-col">
              <h3 className="mb-0 pb-2">{t("Discord Bot")}</h3>
              <p className="card-text mb-auto">
                {t(
                  "I have also created a discord bot useful to control the walkers and make a list of what is needed to create objects."
                )}
              </p>
              <a
                className="btn btn-success m-2"
                href="https://top.gg/bot/715948052979908911"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Go to Discord bot")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="md:col-span-6">{showDiscord()}</div>
      <div className="col-span-full">
        <div className="space-y-4">
          <h3 className="text-center text-info">{t("Sponsored servers")}</h3>
          <div className="max-w-xl mx-auto p-3">
            <a
              href="https://discord.gg/FcecRtZ"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Image
                className="w-full"
                src="/img/banner-lastoasis.jpg"
                alt="Last Oasis Banner"
                width={600}
                height={100}
                priority
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Others;
