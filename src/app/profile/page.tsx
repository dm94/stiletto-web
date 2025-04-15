"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Helmet } from "react-helmet";
import LoadingScreen from "@components/LoadingScreen";
import PrivateProfile from "@components/DiscordConnection/PrivateProfile";
import ModalMessage from "@components/ModalMessage";
import { getStoredItem, storeItem } from "@functions/services";
import { useRouter, useSearchParams } from "next/navigation";
import { getDomain, getDiscordLoginUrl } from "@functions/utils";
import { authDiscord } from "@functions/requests/users";

const DiscordConnection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get("code");

      if (!code || getStoredItem("token")) {
        setIsLoaded(true);
        return;
      }

      try {
        const response = await authDiscord(code);

        if (response) {
          if (response.discordid) {
            storeItem("discordid", response.discordid);
          }
          if (response.token) {
            storeItem("token", response.token);
          }
          router.push("/");
        }
      } catch {
        setError(t("errors.apiConnection"));
      } finally {
        setIsLoaded(true);
      }
    };

    handleAuth();
  }, [searchParams, router, t]);

  const discordLoginUrl = useMemo(() => getDiscordLoginUrl(), []);

  useEffect(() => {
    const discordid = searchParams.get("discordid");
    const token = searchParams.get("token");
    if (discordid && token) {
      storeItem("discordid", discordid);
      storeItem("token", token);
    }
  }, [searchParams]);

  const renderClanInfo = useCallback(() => {
    if (getStoredItem("token")) {
      return <PrivateProfile key="profile" />;
    }

    return (
      <div className="w-full max-w-2xl mx-auto">
        <Helmet>
          <title>Discord Login - Stiletto for Last Oasis</title>
          <meta
            name="description"
            content="Link discord with stiletto and use more functions"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Discord Login - Stiletto for Last Oasis"
          />
          <meta
            name="twitter:description"
            content="Link discord with stiletto and use more functions"
          />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
          />
          <link rel="canonical" href={`${getDomain()}/profile`} />
        </Helmet>
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-6">
            <a
              href={discordLoginUrl}
              className="w-full inline-flex justify-center items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
            >
              <i className="fab fa-discord mr-2" />
              {t("auth.loginWithDiscord")}
            </a>
          </div>
        </div>
      </div>
    );
  }, [t, discordLoginUrl]);

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
      {renderClanInfo()}
    </div>
  );
};

export default DiscordConnection;
