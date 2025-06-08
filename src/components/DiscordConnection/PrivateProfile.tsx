import type React from "react";
import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "@tanstack/react-router"; // Updated Link and added useNavigate
import LoadingScreen from "../LoadingScreen";
import ModalMessage from "../ModalMessage";
import ClanConfig from "../ClanConfig";
import { getDomain, getDiscordLoginUrl } from "@functions/utils"; // Added getDiscordLoginUrl
import { deleteUser, addNick } from "@functions/requests/users"; // Removed getUser
import { leaveClan } from "@functions/requests/clans";
import { supportedLanguages } from "@config/languages";
import { closeSession } from "@functions/services";
import { DEFAULT_LANGUAGE } from "@config/config";
// UserInfo might be implicitly handled by userProfile from useUser
import { useUser } from "@store/userStore";
import { FaUsers, FaFlag, FaDiscord, FaSignOutAlt, FaPlus } from "react-icons/fa"; // Added more icons

const PrivateProfile = () => {
  const { t, i18n } = useTranslation();
  const { userProfile, logout, isLoading, refreshUserProfile, isConnected } = useUser(); // Used from context
  const navigate = useNavigate(); // For navigation

  const [language, setLanguage] = useState(i18n.language ?? DEFAULT_LANGUAGE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [redirect, setRedirect] = useState(false); // This redirect seems for local component logic
  const [nameInGameInput, setNameInGameInput] = useState("");
  const [error, setError] = useState("");
  const [showCreateClanConfig, setShowCreateClanConfig] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setNameInGameInput(userProfile.nickname ?? "");
    }
    // Removed fetchUserProfile as data comes from context
  }, [userProfile]);

  const clearStorageData = () => {
    localStorage.removeItem("profile");
    sessionStorage.removeItem("profile");
    localStorage.removeItem("memberList");
    sessionStorage.removeItem("memberList");
  };

  const handleDeleteUser = useCallback(async () => { // Wrapped in useCallback
    try {
      await deleteUser();
      clearStorageData();
      closeSession(); // This should also trigger logout from context if implemented there
      // No need to call refreshUserProfile if user is being deleted and logged out
    } catch {
      setError(t("errors.apiConnection"));
    }
  }, [t]); // Added dependencies

  const handleAddNickInGame = useCallback(async ( // Wrapped in useCallback
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!userProfile?.discordid) return; // Guard clause

    try {
      await addNick(nameInGameInput); // addNick likely uses userProfile.discordid internally via token
      clearStorageData(); // This might be redundant if refreshUserProfile handles cache correctly
      await refreshUserProfile();
      // setRedirectMessage might be useful if you want to show a success message
    } catch {
      setError(t("errors.apiConnection"));
    }
  }, [nameInGameInput, userProfile?.discordid, refreshUserProfile, t]); // Added dependencies

  const handleLeaveClan = useCallback(async () => { // Wrapped in useCallback
    if (!userProfile?.clanid) return; // Guard clause

    try {
      await leaveClan(); // leaveClan likely uses userProfile info internally via token
      clearStorageData(); // Might be redundant
      await refreshUserProfile();
    } catch {
      setError(t("errors.apiConnection"));
    }
  }, [userProfile?.clanid, refreshUserProfile, t]); // Added dependencies

  const handleLanguageChange = () => { // This seems fine, relates to i18n local state
    i18next.changeLanguage(language);
  };

  const handleCreateClan = useCallback(async () => { // Wrapped in useCallback
    // This function is called from ClanConfig's onClose, implying clan creation might be handled within ClanConfig
    // Or, it's just to refresh user data after ClanConfig closes.
    setShowCreateClanConfig(false); // Close the modal first
    try {
      await refreshUserProfile(); // Refresh data after modal closes
    } catch {
      setError(t("errors.apiConnection"));
    }
  }, [refreshUserProfile, t]); // Added dependencies

  const discordLoginUrl = getDiscordLoginUrl(); // For the login button if user is not found

  if (error) {
    return (
      <ModalMessage
        message={{ isError: true, text: error, redirectPage: "/" }}
      />
    );
  }

  // Use isLoading from context
  if (isLoading && !userProfile) { // Show loading only if userProfile isn't available yet
    return <LoadingScreen />;
  }

  // Check if user is connected and profile exists, or if local redirect is set
  if (!isConnected || redirect) { // redirect is local state, might be for post-action feedback
    // If not connected and not loading, means user is logged out or session expired
    // Or if redirect is true after an action
    return (
      <ModalMessage
        message={{ isError: true, text: "auth.loginAgain2", redirectPage: "/" }}
      />
    );
  }

  // If after loading, userProfile is still null/undefined, means user is not logged in
  if (!userProfile) {
     return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-6 text-center">
            <p className="text-gray-300 mb-4">{t("errors.noUserData")}</p>
            <a
              href={discordLoginUrl}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaDiscord className="mr-2" />
              {t("auth.loginWithDiscord")}
            </a>
          </div>
        </div>
      </div>
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
                <span className="text-gray-400" data-testid="discord-tag">
                  {userProfile?.discordtag}
                </span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-gray-300">{t("profile.nickInGame")}</span>
                <span className="text-gray-400">
                  {userProfile?.nickname ?? t("common.notDefined1")}
                </span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-gray-300">{t("common.clan")}</span>
                <span className="text-gray-400">
                  {userProfile?.clanname ?? t("clan.noClan")}
                </span>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <button
              type="button"
              onClick={() => {
                logout(); // Use logout from context
                setRedirect(true); // Local redirect state
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
            {userProfile?.clanname ? ( // Check userProfile from context
              <>
                <Link
                  to="/members" // Ensure Link is from @tanstack/react-router
                  className="w-full inline-flex items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                >
                  <FaUsers className="mr-2" />
                  {t("menu.clanGeneral")}
                </Link>
                <Link
                  to="/diplomacy" // Ensure Link is from @tanstack/react-router
                  className="w-full inline-flex items-center p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                >
                  <FaFlag className="mr-2" />
                  {t("menu.diplomacy")}
                </Link>
                {userProfile?.discordid !== userProfile?.leaderid && (
                  <button
                    type="button"
                    data-testid="leave-clan-btn"
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
                  to="/clanlist" // Ensure Link is from @tanstack/react-router
                  data-testid="join-clan-btn"
                  className="w-full inline-flex justify-center items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                  {t("clan.joinClan")}
                </Link>
                <button
                  type="button"
                  data-testid="create-clan-btn"
                  onClick={() => setShowCreateClanConfig(true)}
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
              to="/maps" // Ensure Link is from @tanstack/react-router
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
        {/* This section for adding/updating nickname seems fine with local state for input */}
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
                disabled={nameInGameInput === userProfile?.nickname || nameInGameInput === ""} // Disable if same or empty
              >
                {t("common.update")}
              </button>
            </form>
          </div>
        </div>
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

      {showCreateClanConfig && (
        <ClanConfig
          onClose={handleCreateClan} // Changed to pass the function directly
          onError={() => {
            setShowCreateClanConfig(false);
            // Consider if reload is still needed or if refreshUserProfile covers it
            // window.location.reload();
            refreshUserProfile().catch(() => setError(t("errors.apiConnection")));
          }}
        />
      )}
    </div>
  );
};

export default PrivateProfile;
