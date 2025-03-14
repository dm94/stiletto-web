import React from "react";
import { useTranslation } from "react-i18next";

const Others = () => {
  const { t } = useTranslation();

  const showDiscord = () => {
    if (localStorage.getItem("acceptscookies")) {
      return (
        <iframe
          title="discord"
          src="https://discord.com/widget?id=317737508064591874&theme=dark"
          className="w-full"
          height="500"
          frameBorder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />
      );
    }

    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 mb-4">
        <div className="p-4">
          <a
            className="w-full block px-4 py-2 bg-green-500 text-white text-center rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                  {t("Steam Page")}
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
                  {t("Official Discord")}
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
                    {t("Help keep the website running")}
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
                    {t("Help to translate the website")}
                  </a>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600">
                <div className="p-4 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">
                    {t("Discord Bot")}
                  </h3>
                  <p className="mb-4 text-gray-300">
                    {t(
                      "I have also created a discord bot useful to control the walkers and make a list of what is needed to create objects.",
                    )}
                  </p>
                  <a
                    className="inline-block px-4 py-2 bg-green-500 text-white text-center rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
          <div className="md:col-span-1">{showDiscord()}</div>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-blue-500 mb-4">
            {t("Sponsored servers")}
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
                alt="Last Oasis Banner"
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

export default Others;
