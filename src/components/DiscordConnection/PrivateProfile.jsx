import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { getUserProfile, closeSession, getStoredItem } from "../../services";
import LoadingScreen from "../LoadingScreen";
import ModalMessage from "../ModalMessage";
import Icon from "../Icon";
import ClanConfig from "../ClanConfig";
import { getDomain } from "../../functions/utils";
import { deleteUser, addNick } from "../../functions/requests/users";
import { leaveClan } from "../../functions/requests/clan";
import { supportedLanguages } from "../../config/languages";

const PrivateProfile = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    user_discord_id: getStoredItem("discordid"),
    token: getStoredItem("token"),
    discordtag: "Loading...",
    nickname: "Loading...",
    clanname: "Loading...",
    clanid: "",
    clanleaderid: "",
    language: getStoredItem("i18nextLng"),
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [nameInGameInput, setNameInGameInput] = useState("");
  const [error, setError] = useState("");
  const [showClanConfig, setShowClanConfig] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await getUserProfile();
      if (response.success) {
        setUserData({
          ...userData,
          discordtag: response.message.discordtag,
          clanname: response.message.clanname,
          clanid: response.message.clanid,
          nickname: response.message.nickname,
          clanleaderid: response.message.leaderid,
          user_discord_id: response.message.discordid,
        });
        setIsLoaded(true);
      } else {
        setError(response.message);
        setIsLoaded(true);
      }
    };
    fetchUserProfile();
  }, []);

  const clearStorageData = () => {
    localStorage.removeItem("profile");
    sessionStorage.removeItem("profile");
    localStorage.removeItem("memberList");
    sessionStorage.removeItem("memberList");
  };

  const handleDeleteUser = async (event) => {
    event.preventDefault();
    try {
      const response = await deleteUser();
      clearStorageData();

      if (response.status === 204) {
        closeSession();
        setRedirect(true);
      } else if (response.status === 401) {
        closeSession();
        setError(t("Log in again"));
      } else if (response.status === 503) {
        setError(t("Error connecting to database"));
      }
    } catch {
      setError(t("Error when connecting to the API"));
    }
  };

  const handleAddNickInGame = async (event) => {
    event.preventDefault();
    try {
      const response = await addNick(nameInGameInput);
      clearStorageData();

      if (response.status === 202) {
        setUserData({ ...userData, nickname: nameInGameInput });
      } else if (response.status === 401) {
        closeSession();
        setError(t("Log in again"));
      } else if (response.status === 503) {
        setError(t("Error connecting to database"));
      }
    } catch {
      setError(t("Error when connecting to the API"));
    }
  };

  const handleLeaveClan = async (event) => {
    event.preventDefault();
    try {
      const response = await leaveClan();
      clearStorageData();

      if (response.status === 204) {
        setUserData({ ...userData, clanname: "" });
      } else if (response.status === 401) {
        closeSession();
        setError(t("Log in again"));
      } else if (response.status === 503) {
        setError(t("Error connecting to database"));
      }
    } catch {
      setError(t("Error when connecting to the API"));
    }
  };

  const handleLanguageChange = () => {
    i18next.changeLanguage(userData.language);
  };

  const renderChangeNamePart = () => {
    if (userData.nickname === "Loading..." || !userData.nickname) {
      return (
        <div className="col-xl-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">{t("Add name in the game")}</div>
            <div className="card-body text-succes">
              <form onSubmit={handleAddNickInGame}>
                <div className="form-group">
                  <label htmlFor="user_game_name">
                    {t("Your name in Last Oasis")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="nameInGameInput"
                    value={nameInGameInput}
                    onChange={(e) => setNameInGameInput(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="btn btn-lg btn-success btn-block"
                  type="submit"
                >
                  {t("Add")}
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    return "";
  };

  const renderManageClanPart = () => {
    if (userData.clanname === "Loading..." || !userData.clanname) {
      return (
        <div className="col-xl-6">
          <div className="card border-secondary mb-3">
            <div className="card-header">
              <Link
                className="btn btn-lg btn-info btn-block"
                to="/clanlist"
                data-cy="join-clan-btn"
              >
                {t("Join a clan")}
              </Link>
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="btn btn-lg btn-success btn-block"
                data-cy="create-clan-btn"
                onClick={() => setShowClanConfig(true)}
              >
                {t("Create a clan")}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="col-xl-6">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("Manage Clan")}</div>
          <div className="card-body">
            <Link className="btn btn-lg btn-secondary btn-block" to="/members">
              <i className="fas fa-users" /> {t("Members")}
            </Link>
            <Link
              className="btn btn-lg btn-secondary btn-block"
              to="/walkerlist"
            >
              <Icon key="Base Wings" name="Base Wings" width="30" />
              {t("Walker List")}
            </Link>
            <Link
              className="btn btn-lg btn-secondary btn-block"
              to="/diplomacy"
            >
              <i className="far fa-flag" /> {t("Diplomacy")}
            </Link>
          </div>
          {userData.clanleaderid !== userData.user_discord_id && (
            <div className="card-footer">
              <button
                type="button"
                className="btn btn-lg btn-danger btn-block"
                data-cy="leave-clan-btn"
                onClick={handleLeaveClan}
              >
                {t("Leave clan")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <ModalMessage
        message={{ isError: true, text: error, redirectPage: "/" }}
      />
    );
  }

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!getStoredItem("token") || redirect) {
    return (
      <ModalMessage
        message={{ isError: true, text: "Login again", redirectPage: "/" }}
      />
    );
  }

  return (
    <div className="row">
      <Helmet>
        <title>{t("Profile")} - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="Private profile where you can configure some things"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Perfil - Stiletto for Last Oasis" />
        <meta
          name="twitter:description"
          content="Private profile where you can configure some things"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/profile`} />
      </Helmet>

      {showClanConfig && (
        <ClanConfig
          key="clanconfig"
          clanid={userData.clanid}
          onClose={() => {
            setShowClanConfig(false);
            clearStorageData();
          }}
          onError={setError}
        />
      )}

      <div className="col-xl-6">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("Your details")}</div>
          <div className="card-body">
            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between lh-condensed">
                <div className="my-0">{t("Discord Tag")}</div>
                <div className="text-muted" data-cy="discord-tag">
                  {userData.discordtag}
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-condensed">
                <div className="my-0">{t("Nick in Game")}</div>
                <div className="text-muted">
                  {userData.nickname || t("Not defined")}
                </div>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-condensed">
                <div className="my-0">{t("Clan")}</div>
                <div className="text-muted">
                  {userData.clanname || t("No Clan")}
                </div>
              </li>
            </ul>
          </div>
          <div className="card-footer">
            <button
              type="button"
              className="btn btn-lg btn-warning btn-block"
              onClick={() => {
                closeSession();
                setRedirect(true);
              }}
            >
              {t("Close session")}
            </button>
            <button
              type="button"
              className="btn btn-lg btn-danger btn-block"
              onClick={() => setShowDeleteModal(true)}
            >
              {t("Delete user")}
            </button>
          </div>
        </div>
      </div>

      <div className={showDeleteModal ? "modal d-block" : "modal d-none"}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteusermodal">
                {t("Are you sure?")}
              </h5>
            </div>
            <div className="modal-body">
              <p>
                {t(
                  "This option is not reversible, your user and all his data will be deleted."
                )}
              </p>
              <p>
                {t(
                  "The administrator will be notified to delete the user, the user will not be deleted directly."
                )}
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteUser}
              >
                {t("Delete user")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {renderChangeNamePart()}
      {renderManageClanPart()}

      <div className="col-xl-6">
        <div className="card border-secondary mb-3">
          <div className="card-body">
            <Link className="btn btn-lg btn-secondary btn-block" to="/maps">
              {t("Resource Maps")}
            </Link>
          </div>
        </div>
      </div>

      <div className="col-xl-6">
        <div className="card border-secondary mb-3">
          <div className="card-header">{t("Change language")}</div>
          <div className="card-body">
            <div className="row">
              <div className="col">
                <select
                  id="changeLanguajeSelect"
                  className="custom-select"
                  value={userData.language || "en"}
                  onChange={(e) =>
                    setUserData({ ...userData, language: e.target.value })
                  }
                >
                  {supportedLanguages.map((language) => (
                    <option key={language.key} value={language.key}>
                      {t(language.name)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLanguageChange}
                >
                  {t("Change language")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateProfile;
