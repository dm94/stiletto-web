import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import { Link } from "react-router";
import LoadingScreen from "../LoadingScreen";
import ModalMessage from "../ModalMessage";
import Icon from "../Icon";
import ClanConfig from "../ClanConfig";
import { getDomain } from "../../functions/utils";
import { deleteUser, addNick } from "../../functions/requests/users";
import { leaveClan } from "../../functions/requests/clan";
import { supportedLanguages } from "../../config/languages";
import {
  closeSession,
  getUserProfile,
  getStoredItem,
} from "../../functions/services";

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
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Profile - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="Manage your profile and clan settings"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Profile - Stiletto for Last Oasis"
        />
        <meta
          name="twitter:description"
          content="Manage your profile and clan settings"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/crafter.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/profile`} />
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datos del usuario */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {t("Your details")}
            </h2>
          </div>
          <div className="p-0">
            <div className="divide-y divide-gray-700">
              <div className="flex justify-between items-center p-3">
                <span className="text-gray-300">{t("Discord Tag")}</span>
                <span className="text-gray-400" data-cy="discord-tag">
                  {userData.discordtag}
                </span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-gray-300">{t("Nick in Game")}</span>
                <span className="text-gray-400">
                  {userData.nickname || t("Not defined")}
                </span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-gray-300">{t("Clan")}</span>
                <span className="text-gray-400">
                  {userData.clanname || t("No Clan")}
                </span>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <button
              type="button"
              onClick={() => {
                closeSession();
                setRedirect(true);
              }}
              className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none"
            >
              {t("Close session")}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
            >
              {t("Delete user")}
            </button>
          </div>
        </div>

        {/* Gestión del clan */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">{t("Manage Clan")}</h2>
          </div>
          <div className="p-3 space-y-2">
            {userData.clanname && userData.clanname !== "Loading..." ? (
              <>
                <Link
                  to="/members"
                  className="w-full inline-flex items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                >
                  <i className="fas fa-users mr-2" />
                  {t("Members")}
                </Link>
                <Link
                  to="/walkerlist"
                  className="w-full inline-flex items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                >
                  <Icon
                    key="Base Wings"
                    name="Base Wings"
                    width="30"
                    className="mr-2"
                  />
                  {t("Walker List")}
                </Link>
                <Link
                  to="/diplomacy"
                  className="w-full inline-flex items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                >
                  <i className="far fa-flag mr-2" />
                  {t("Diplomacy")}
                </Link>
                {userData.clanleaderid !== userData.user_discord_id && (
                  <button
                    type="button"
                    data-cy="leave-clan-btn"
                    onClick={handleLeaveClan}
                    className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    {t("Leave clan")}
                  </button>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/clanlist"
                  data-cy="join-clan-btn"
                  className="w-full inline-flex justify-center items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                  {t("Join a clan")}
                </Link>
                <button
                  type="button"
                  data-cy="create-clan-btn"
                  onClick={() => setShowClanConfig(true)}
                  className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
                >
                  {t("Create a clan")}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Enlace a mapas */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3">
            <Link
              to="/maps"
              className="w-full inline-flex justify-center items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
            >
              {t("Resource Maps")}
            </Link>
          </div>
        </div>

        {/* Selector de idioma */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {t("Change language")}
            </h2>
          </div>
          <div className="p-3">
            <div className="flex space-x-2">
              <select
                id="changeLanguajeSelect"
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
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
              <button
                type="button"
                onClick={handleLanguageChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                {t("Change language")}
              </button>
            </div>
          </div>
        </div>

        {/* Añadir nombre en el juego (solo si no tiene) */}
        {(!userData.nickname || userData.nickname === "Loading...") && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-3 bg-gray-900 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {t("Add name in the game")}
              </h2>
            </div>
            <div className="p-3">
              <form onSubmit={handleAddNickInGame} className="space-y-3">
                <div>
                  <label
                    htmlFor="user_game_name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    {t("Your name in Last Oasis")}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
                    name="nameInGameInput"
                    value={nameInGameInput}
                    onChange={(e) => setNameInGameInput(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
                >
                  {t("Add")}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de borrado */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75" />
            </div>
            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-300"
                      id="deleteusermodal"
                    >
                      {t("Are you sure?")}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        {t(
                          "This option is not reversible, your user and all his data will be deleted.",
                        )}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {t(
                          "The administrator will be notified to delete the user, the user will not be deleted directly.",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteUser}
                >
                  {t("Delete user")}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t("Cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showClanConfig && (
        <ClanConfig
          onClose={() => setShowClanConfig(false)}
          onSuccess={() => {
            setShowClanConfig(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default PrivateProfile;
