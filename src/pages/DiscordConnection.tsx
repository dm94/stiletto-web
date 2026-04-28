import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@components/LoadingScreen";
import PrivateProfile from "@components/DiscordConnection/PrivateProfile";
import ModalMessage from "@components/ModalMessage";
import HeaderMeta from "@components/HeaderMeta";
import { useRouter, useSearchParams } from "next/navigation";
import { getDomain, getDiscordLoginUrl } from "@functions/utils";
import { authDiscord } from "@functions/requests/users";
import { useUser } from "@store/userStore";
import { FaDiscord } from "react-icons/fa";
import { useLanguagePrefix } from "@hooks/useLanguagePrefix";

const DiscordConnection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getLanguagePrefixedPath } = useLanguagePrefix();
  const { login, isConnected } = useUser();

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams?.get("code");
      if (!code || isConnected) {
        setIsLoaded(true);
        return;
      }

      try {
        const response = await authDiscord(code);

        if (response?.discordid && response?.token) {
          login(response.discordid, response.token);
          router.push(getLanguagePrefixedPath("/"));
        }
      } catch {
        setError(t("errors.apiConnection"));
      } finally {
        setIsLoaded(true);
      }
    };

    handleAuth();
  }, [searchParams, router, getLanguagePrefixedPath, t, login, isConnected]);

  const discordLoginUrl = useMemo(() => getDiscordLoginUrl(), []);

  useEffect(() => {
    const discordid = searchParams?.get("discordid");
    const token = searchParams?.get("token");
    if (discordid && token) {
      login(discordid, token);
    }
  }, [searchParams, login]);

  const clanInfo = isConnected ? (
    <PrivateProfile key="profile" />
  ) : (
    <div className="w-full max-w-2xl mx-auto">
      <HeaderMeta
        title={t("seo.discord.title", "Discord Login - Stiletto for Last Oasis")}
        description={t(
          "seo.discord.description",
          "Link discord with stiletto and use more functions",
        )}
        canonical={`${getDomain()}/profile`}
        image="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
        keywords="Last Oasis Discord, Discord integration, game login, Stiletto app, clan management, Last Oasis account linking, Discord authentication, game profile connection, Last Oasis community, Discord sync, game utility tools"
      />
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <h2 className="sr-only">{t("auth.loginWithDiscord")}</h2>
        <div className="p-6">
          <a
            href={discordLoginUrl}
            className="w-full inline-flex justify-center items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
          >
            <FaDiscord className="mr-2" />
            {t("auth.loginWithDiscord")}
          </a>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/",
        }}
      />
    );
  }

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex items-center justify-center p-4">
      <h1 className="sr-only">
        {t("seo.discord.title", "Discord Login - Stiletto for Last Oasis")}
      </h1>
      {clanInfo}
    </div>
  );
};

export default DiscordConnection;
