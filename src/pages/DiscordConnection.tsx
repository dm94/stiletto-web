import type React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import LoadingScreen from "../components/LoadingScreen";
import PrivateProfile from "../components/DiscordConnection/PrivateProfile";
import ModalMessage from "../components/ModalMessage";
import { getStoredItem, storeItem } from "../functions/services";
import { useNavigate, useLocation } from "react-router";
import { getDomain, getDiscordLoginUrl } from "../functions/utils";
import { authDiscord } from "../functions/requests/users";

const DiscordConnection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuth = async () => {
      const parsed = queryString.parse(location?.search);
      if (!parsed.code) {
        setIsLoaded(true);
        return;
      }

      if (getStoredItem("token")) {
        setIsLoaded(true);
        return;
      }

      try {
        const response = await authDiscord(String(parsed.code));

        if (response) {
          if (response.discordid) {
            storeItem("discordid", response.discordid);
          }
          if (response.token) {
            storeItem("token", response.token);
          }
          navigate("/");
        }
      } catch {
        setError("Error connecting to server");
      }
      setIsLoaded(true);
    };

    handleAuth();
  }, [location, navigate]);

  const renderClanInfo = () => {
    const parsed = queryString.parse(location?.search);
    const urlLink = getDiscordLoginUrl();

    if (parsed.discordid && parsed.token) {
      storeItem("discordid", String(parsed.discordid));
      storeItem("token", String(parsed.token));
    }

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
              href={urlLink}
              className="w-full inline-flex justify-center items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
            >
              <i className="fab fa-discord mr-2" />
              {t("auth.loginWithDiscord")}
            </a>
          </div>
        </div>
      </div>
    );
  };

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
