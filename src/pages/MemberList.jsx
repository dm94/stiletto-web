import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import ClanConfig from "../components/ClanConfig";
import MemberListItem from "../components/MemberList/MemberListItem";
import RequestMemberListItem from "../components/MemberList/RequestMemberListItem";
import DiscordConfig from "../components/MemberList/DiscordConfig";
import MemberPermissionsConfig from "../components/MemberList/MemberPermissionsConfig";
import { sendNotification } from "../functions/broadcast";
import { getDomain } from "../functions/utils";
import { getRequests } from "../functions/requests/clans/requests";
import { updateMember } from "../functions/requests/clans/members";
import { deleteClan } from "../functions/requests/clan";
import {
  closeSession,
  getCachedMembers,
  getUserProfile,
  getHasPermissions,
  getStoredItem,
} from "../functions/services";

const MemberList = () => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [members, setMembers] = useState([]);
  const [requestMembers, setRequestMembers] = useState(false);
  const [error, setError] = useState(false);
  const [isLoadedRequestList, setIsLoadedRequestList] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState(false);
  const [selectNewOwner, setSelectNewOwner] = useState(
    getStoredItem("discordid"),
  );
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [showBotConfig, setShowBotConfig] = useState(false);
  const [clanid, setClanid] = useState(false);
  const [showClanConfig, setShowClanConfig] = useState(false);
  const [hasBotPermissions, setHasBotPermissions] = useState(false);
  const [hasRequestPermissions, setHasRequestPermissions] = useState(false);
  const [hasKickMembersPermisssions, setHasKickMembersPermisssions] =
    useState(false);
  const [memberForEdit, setMemberForEdit] = useState(false);

  const updateMembers = useCallback(async () => {
    const response = await getCachedMembers();
    if (response.success) {
      setMembers(response.message);
      setIsLoaded(true);
    } else {
      setError(response.message);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const initializeComponent = async () => {
      const userProfile = await getUserProfile();
      if (userProfile.success) {
        setClanid(userProfile.message.clanid);
        setIsLeader(
          userProfile.message.discordid === userProfile.message.leaderid,
        );
      } else {
        setError(userProfile.message);
        setIsLoaded(true);
        return;
      }

      await updateMembers();

      try {
        const response = await getRequests(userProfile.message.clanid);

        if (response.status === 202) {
          const data = await response.json();
          setRequestMembers(data);
        } else if (response.status === 405 || response.status === 401) {
          closeSession();
          setError("You don't have access here, try to log in again");
        } else if (response.status === 503) {
          setError("Error connecting to database");
        }
        setIsLoadedRequestList(true);
      } catch {
        setError("Error when connecting to the API");
      }

      const botPermissions = await getHasPermissions("bot");
      const requestPermissions = await getHasPermissions("request");
      const kickPermissions = await getHasPermissions("kickmembers");

      setHasBotPermissions(botPermissions);
      setHasRequestPermissions(requestPermissions);
      setHasKickMembersPermisssions(kickPermissions);
    };

    initializeComponent();
  }, [updateMembers]);

  const kickMember = async (memberdiscordid) => {
    try {
      const response = await updateMember(clanid, memberdiscordid, "kick");

      localStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList");
      localStorage.removeItem("memberList-lastCheck");
      sessionStorage.removeItem("memberList-lastCheck");

      if (response.status === 202) {
        setMembers(members.filter((m) => m.discordid !== memberdiscordid));
      } else if (response.status === 405 || response.status === 401) {
        closeSession();
        setError("You don't have access here, try to log in again");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("Error when connecting to the API");
    }
  };

  const acceptMember = async () => {
    setShowRequestModal(false);
    if (!requestData) {
      return;
    }

    try {
      const response = await updateMember(
        clanid,
        requestData.discordid,
        "accept",
      );

      localStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList-lastCheck");
      localStorage.removeItem("memberList-lastCheck");

      if (response.status === 202) {
        setRequestMembers(
          requestMembers.filter((m) => m.discordid !== requestData.discordid),
        );
        updateMembers();
      } else if (response.status === 405 || response.status === 401) {
        closeSession();
        setError("You don't have access here, try to log in again");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
      setRequestData(false);
    } catch {
      setError("Error when connecting to the API");
    }
  };

  const rejectMember = async () => {
    setShowRequestModal(false);
    if (!requestData) {
      return;
    }

    try {
      const response = await updateMember(
        clanid,
        requestData.discordid,
        "reject",
      );

      localStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList-lastCheck");
      localStorage.removeItem("memberList-lastCheck");

      if (response.status === 202) {
        setRequestMembers(
          requestMembers.filter((m) => m.discordid !== requestData.discordid),
        );
        updateMembers();
      } else if (response.status === 405 || response.status === 401) {
        closeSession();
        setError("You don't have access here, try to log in again");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
      setRequestData(false);
    } catch {
      setError("Error when connecting to the API");
    }
  };

  const handleDeleteClan = async () => {
    try {
      const response = await deleteClan(clanid);

      localStorage.removeItem("profile");
      sessionStorage.removeItem("profile");
      sessionStorage.removeItem("memberList-lastCheck");
      sessionStorage.removeItem("memberList");
      localStorage.removeItem("memberList");
      localStorage.removeItem("memberList-lastCheck");

      if (response.status === 204) {
        setRedirectMessage("Clan deleted correctly");
      } else if (response.status === 405) {
        closeSession();
        setError("You don't have access here, try to log in again");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("Error when connecting to the API");
    }
  };

  const changeOwner = async () => {
    try {
      const response = await updateMember(clanid, selectNewOwner, "owner");

      localStorage.removeItem("profile");
      sessionStorage.removeItem("profile");
      localStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList-lastCheck");
      localStorage.removeItem("memberList-lastCheck");

      if (response.status === 202) {
        setRedirectMessage("Clan updated correctly");
      } else if (response.status === 405 || response.status === 401) {
        closeSession();
        setError("You don't have access here, try to log in again");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("Error when connecting to the API");
    }
  };

  const renderMemberList = () => {
    if (members) {
      return members?.map((member) => (
        <MemberListItem
          key={member.discordid}
          member={member}
          onKick={kickMember}
          onClickEditPermissions={(discordid) => setMemberForEdit(discordid)}
          isLeader={isLeader}
          hasPermissions={hasKickMembersPermisssions}
        />
      ));
    }
    return "";
  };

  const renderRequestList = () => {
    if (isLoadedRequestList) {
      if (requestMembers && requestMembers.length > 0) {
        return requestMembers.map((member) => (
          <RequestMemberListItem
            key={member.discordid}
            member={member}
            isLeader={isLeader || hasRequestPermissions}
            onShowRequest={(r) => {
              setRequestData(r);
              setShowRequestModal(true);
            }}
          />
        ));
      }
      return (
        <tr>
          <td colSpan="4" className="text-center py-4 text-gray-400">
            {t("There are no pending requests")}
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td colSpan="4" className="text-center py-4 text-gray-400">
          {t("Loading the list of requests to enter the clan")}
        </td>
      </tr>
    );
  };

  const renderDeleteClanButton = () => {
    if (members && isLeader) {
      return (
        <div className="w-full lg:w-1/3 px-2">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg mb-4">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 font-medium text-white">
              {t("Delete Clan")}
            </div>
            <div className="p-4 text-gray-300">
              {t(
                "By deleting the clan you will delete all the data linked to it, be careful because this option is not reversible",
              )}
            </div>
            <div className="px-4 py-3 bg-gray-900 border-t border-gray-700">
              <button
                type="button"
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleDeleteClan}
              >
                {t("Delete")}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return "";
  };

  const renderTransferOwnerPanel = () => {
    if (members && isLeader) {
      return (
        <div className="w-full lg:w-1/3 px-2">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg mb-4">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 font-medium text-white">
              {t("Transfer Clan")}
            </div>
            <div className="p-4 text-gray-300">
              <p className="mb-4">
                {t(
                  "This option is not reversible, so be careful who you pass it on to in the leadership of the clan",
                )}
              </p>
              <label
                htmlFor="selectNewOwner"
                className="block mb-2 text-sm font-medium"
              >
                {t("New leader:")}
              </label>
              <select
                id="selectNewOwner"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectNewOwner}
                onChange={(evt) => setSelectNewOwner(evt.target.value)}
              >
                {members.map((member) => (
                  <option key={member.discordid} value={member.discordid}>
                    {member.discordtag}
                  </option>
                ))}
              </select>
            </div>
            <div className="px-4 py-3 bg-gray-900 border-t border-gray-700">
              <button
                type="button"
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={changeOwner}
              >
                {t("Change leader")}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return "";
  };

  if (error) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: error,
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (redirectMessage) {
    return (
      <ModalMessage
        message={{
          isError: false,
          text: redirectMessage,
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!clanid) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: "You do not have permission to access this page",
          redirectPage: "/profile",
        }}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Clan Member List - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="This is the list of all the members of your clan"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Clan Member List - Stiletto for Last Oasis"
        />
        <meta
          name="twitter:description"
          content="This is the list of all the members of your clan"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/diplomacy.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/members`} />
      </Helmet>

      <div className={isLeader || hasBotPermissions ? "w-full mb-6" : "hidden"}>
        <div className="flex flex-wrap justify-between">
          <div className={isLeader ? "mb-4" : "hidden"}>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-l-lg flex items-center justify-center"
                disabled
              >
                <i className="fas fa-users-cog" />
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowClanConfig(true)}
              >
                {t("Clan Configuration")}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-l-lg flex items-center justify-center"
                disabled
              >
                <i className="fab fa-discord" />
              </button>
              <button
                type="button"
                className={
                  isLeader || hasBotPermissions
                    ? "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : "hidden"
                }
                onClick={() => setShowBotConfig(true)}
              >
                {t("Discord Bot Configuration")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap -mx-2">
        <div className="w-full lg:w-1/2 px-2 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 font-medium text-white">
              {t("Member List")}
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-gray-300 text-left">
                      <th className="px-4 py-2 rounded-tl-lg">
                        {t("Discord Tag")}
                      </th>
                      <th className="px-4 py-2">{t("Nick in Game")}</th>
                      <th
                        className={
                          members && (isLeader || hasKickMembersPermisssions)
                            ? "px-4 py-2"
                            : "hidden"
                        }
                      >
                        {t("Kick")}
                      </th>
                      <th
                        className={
                          members && isLeader
                            ? "px-4 py-2 rounded-tr-lg"
                            : "hidden"
                        }
                      >
                        {t("Edit")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {renderMemberList()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 px-2 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 font-medium text-white">
              {t("List of requests")}
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-gray-300 text-left">
                      <th className="px-4 py-2 rounded-tl-lg">
                        {t("Discord Tag")}
                      </th>
                      <th className="px-4 py-2">{t("Nick in Game")}</th>
                      <th
                        className={
                          members && (isLeader || hasRequestPermissions)
                            ? "px-4 py-2 rounded-tr-lg"
                            : "hidden"
                        }
                      >
                        {t("Show request")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {renderRequestList()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {renderTransferOwnerPanel()}
        {renderDeleteClanButton()}
      </div>

      {/* Request Modal */}
      <div
        className={
          showRequestModal
            ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            : "hidden"
        }
      >
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4">
          <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
            <h5 className="text-white font-medium">{t("Request")}</h5>
          </div>
          <div className="p-4 text-gray-300">
            {requestData ? requestData.message : ""}
          </div>
          <div className="p-4 bg-gray-900 border-t border-gray-700 flex flex-col space-y-2">
            <button
              type="button"
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={acceptMember}
            >
              {t("Accept")}
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={rejectMember}
            >
              {t("Reject")}
            </button>
          </div>
        </div>
      </div>

      {showBotConfig && (
        <DiscordConfig
          key="discordbotconfig"
          clanid={clanid}
          onClose={() => setShowBotConfig(false)}
          onError={(error) => sendNotification(error, "Error")}
        />
      )}
      {showClanConfig && (
        <ClanConfig
          key="clanconfig"
          clanid={clanid}
          onClose={() => setShowClanConfig(false)}
          onError={(error) => sendNotification(error, "Error")}
        />
      )}
      {memberForEdit && (
        <MemberPermissionsConfig
          key="discordbotconfig"
          clanid={clanid}
          memberid={memberForEdit}
          onClose={() => setMemberForEdit(false)}
          onError={(error) => sendNotification(error, "Error")}
        />
      )}
    </div>
  );
};

export default MemberList;
