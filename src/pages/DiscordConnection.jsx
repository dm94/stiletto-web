import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import LoadingScreen from "../components/LoadingScreen";
import PrivateProfile from "../components/DiscordConnection/PrivateProfile";
import ModalMessage from "../components/ModalMessage";
import { getStoredItem, storeItem } from "../services";
import { useHistory } from "react-router-dom";
import { getDomain, getDiscordLoginUrl } from "../functions/utils";
import { authDiscord } from "../functions/requests/users";

const DiscordConnection = ({ location }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const history = useHistory();

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
        const response = await authDiscord(parsed.code);

        if (response.status === 202) {
          const data = await response.json();
          if (data.discordid) {
            storeItem("discordid", data.discordid);
          }
          if (data.token) {
            storeItem("token", data.token);
          }
          history.replace({ from: { pathname: "/" } });
        } else if (response.status === 401) {
          setError("Unauthorized");
        } else if (response.status === 503) {
          setError("Error connecting to database");
        }
      } catch {
        setError("Error connecting to server");
      }
      setIsLoaded(true);
    };

    handleAuth();
  }, [location, history]);

  const renderClanInfo = () => {
    const parsed = queryString.parse(location?.search);
    const urlLink = getDiscordLoginUrl();

    if (parsed.discordid && parsed.token) {
      storeItem("discordid", parsed.discordid);
      storeItem("token", parsed.token);
    }

    if (getStoredItem("token")) {
      return <PrivateProfile key="profile" />;
    }

    return (
      <div className="row">
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
        <div className="col-12 col-md-6 mx-auto">
          <div className="card border-secondary mb-3">
            <div className="card-body text-succes">
              <a
                className="btn btn-lg btn-outline-primary btn-block"
                href={urlLink}
              >
                <i className="fab fa-discord" /> {t("Login with discord")}
              </a>
            </div>
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

  return <div className="h-100 container">{renderClanInfo()}</div>;
};

export default DiscordConnection;
