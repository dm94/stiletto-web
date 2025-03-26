import type React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import { Link } from "react-router";
import LoadingScreen from "../LoadingScreen";
import ModalMessage from "../ModalMessage";
import Icon from "../Icon";
import ClanConfig from "../ClanConfig";
import { getDomain } from "../../functions/utils";
import { deleteUser, addNick, getUser } from "../../functions/requests/users";
import { leaveClan } from "../../functions/requests/clans";
import { supportedLanguages } from "../../config/languages";
import { closeSession, getStoredItem } from "../../functions/services";
import { DEFAULT_LANGUAGE } from "../../config/config";
import type { UserInfo } from "../../types/dto/users";

const PrivateProfile = () => {
  const { t, i18n } = useTranslation();
  const [userData, setUserData] = useState<UserInfo>();
  const [language, setLanguage] = useState(i18n.language ?? DEFAULT_LANGUAGE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [nameInGameInput, setNameInGameInput] = useState("");
  const [error, setError] = useState("");
  const [showClanConfig, setShowClanConfig] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUser();
        setUserData(response);
      } catch {
        setError("errors.apiConnection");
      } finally {
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

  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      clearStorageData();
      closeSession();
    } catch {
      setError(t("errors.apiConnection"));
    }
  };

  const handleAddNickInGame = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      await addNick(nameInGameInput);
      clearStorageData();

      const user = await getUser();
      setUserData(user);
    } catch {
      setError(t("errors.apiConnection"));
    }
  };

  const handleLeaveClan = async () => {
    try {
      await leaveClan();
      clearStorageData();

      const response = await getUser();

      setUserData(response);
    } catch {
      setError(t("errors.apiConnection"));
    }
  };

  const handleLanguageChange = () => {
    i18next.changeLanguage(language);
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
        message={{ isError: true, text: "auth.loginAgain2", redirectPage: "/" }}
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
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {t("profile.yourDetails")}
            </h2>
          </div>
          <div className="p-0">
            <div className="divide-y divide-gray-700">
              <div className="flex justify-between items-center p-3">
                <span className="text-gray-300">{t("profile.discordTag")}</span>
                <span className="text-gray-400" data-cy="discord-tag">
                  {userData?.discordtag}
                </span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-gray-300">{t("profile.nickInGame")}</span>
                <span className="text-gray-400">
                  {userData?.nickname ?? t("common.notDefined1")}
                </span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-gray-300">{t("common.clan")}</span>
                <span className="text-gray-400">
                  {userData?.clanname ?? t("clan.noClan")}
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
              {t("auth.closeSession")}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
            >
              {t("profile.deleteUser")}
            </button>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {t("clan.manageClan")}
            </h2>
          </div>
          <div className="p-3 space-y-2">
            {isLoaded && userData?.clanname ? (
              <>
                <Link
                  to="/members"
                  className="w-full inline-flex items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                >
                  <i className="fas fa-users mr-2" />
                  {t("menu.members")}
                </Link>
                <Link
                  to="/walkerlist"
                  className="w-full inline-flex items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                >
                  <Icon key="Base Wings" name="Base Wings" width={30} />
                  {t("menu.walkerList")}
                </Link>
                <Link
                  to="/diplomacy"
                  className="w-full inline-flex items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                >
                  <i className="far fa-flag mr-2" />
                  {t("menu.diplomacy")}
                </Link>
                {isLoaded && userData?.discordid !== userData?.leaderid && (
                  <button
                    type="button"
                    data-cy="leave-clan-btn"
                    onClick={handleLeaveClan}
                    className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    {t("clan.leaveClan")}
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
                  {t("clan.joinClan")}
                </Link>
                <button
                  type="button"
                  data-cy="create-clan-btn"
                  onClick={() => setShowClanConfig(true)}
                  className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
                >
                  {t("clan.createClan")}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3">
            <Link
              to="/maps"
              className="w-full inline-flex justify-center items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
            >
              {t("menu.resourceMaps")}
            </Link>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {t("settings.changeLanguage")}
            </h2>
          </div>
          <div className="p-3">
            <div className="flex space-x-2">
              <select
                id="changeLanguajeSelect"
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
                {t("settings.changeLanguage")}
              </button>
            </div>
          </div>
        </div>
        {isLoaded && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-3 bg-gray-900 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {t("profile.addNameInGame")}
              </h2>
            </div>
            <div className="p-3">
              <form onSubmit={handleAddNickInGame} className="space-y-3">
                <div>
                  <label
                    htmlFor="user_game_name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    {t("profile.yourNameInGame")}
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
                  {t("common.add")}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
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
                      {t("common.areYouSure")}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        {t("profile.deleteWarning")}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {t("profile.deleteNotice")}
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
                  {t("profile.deleteUser")}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showClanConfig && (
        <ClanConfig
          onClose={() => setShowClanConfig(false)}
          onError={() => {
            setShowClanConfig(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default PrivateProfile;
