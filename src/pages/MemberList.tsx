import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import ModalMessage from "@components/ModalMessage";
import LoadingScreen from "@components/LoadingScreen";
import ClanConfig from "@components/ClanConfig";
import MemberListItem from "@components/MemberList/MemberListItem";
import RequestMemberListItem from "@components/MemberList/RequestMemberListItem";
import DiscordConfig from "@components/MemberList/DiscordConfig";
import MemberPermissionsConfig from "@components/MemberList/MemberPermissionsConfig";
import { sendNotification } from "@functions/broadcast";
import { getDomain } from "@functions/utils";
import { getRequests, updateRequest } from "@functions/requests/clans/requests";
import {
  getMemberPermissions,
  getMembers,
  updateMember,
} from "@functions/requests/clans/members";
import { deleteClan } from "@functions/requests/clans";
import { useUser } from "@store/userStore";
import {
  MemberAction,
  type MemberInfo,
  type MemberRequest,
} from "@ctypes/dto/members";
import { RequestAction } from "@ctypes/dto/requests";
import { getUser } from "@functions/requests/users";

const MemberList = () => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [requestMembers, setRequestMembers] = useState<MemberRequest[]>([]);
  const [error, setError] = useState<string>();
  const [isLoadedRequestList, setIsLoadedRequestList] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState<string>();
  const { discordId } = useUser();
  const [selectNewOwner, setSelectNewOwner] = useState<string>(discordId ?? "");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState<MemberRequest>();
  const [isLeader, setIsLeader] = useState(false);
  const [showBotConfig, setShowBotConfig] = useState(false);
  const [clanid, setClanid] = useState<number>();

  const [showClanConfig, setShowClanConfig] = useState(false);
  const [hasBotPermissions, setHasBotPermissions] = useState(false);
  const [hasRequestPermissions, setHasRequestPermissions] = useState(false);
  const [hasKickMembersPermisssions, setHasKickMembersPermisssions] =
    useState(false);
  const [memberForEdit, setMemberForEdit] = useState<string | false>(false);

  const updateMembers = useCallback(async () => {
    if (!clanid) {
      return;
    }

    try {
      const response = await getMembers(clanid);

      setMembers(response);
      setIsLoaded(true);
    } catch {
      setError("errors.apiConnection");
    }
  }, [clanid]);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const userProfile = await getUser();

        if (!userProfile.clanid) {
          setError("errors.noClan");
        }

        if (userProfile) {
          setClanid(userProfile.clanid);
          setIsLeader(userProfile.discordid === userProfile.leaderid);
        } else {
          setError("errors.apiConnection");
          setIsLoaded(true);
          return;
        }

        await updateMembers();

        if (!userProfile?.clanid) {
          return;
        }

        try {
          const response = await getRequests(userProfile.clanid);

          if (response) {
            setRequestMembers(response);
          }
          setIsLoadedRequestList(true);
        } catch {
          setError("errors.apiConnection");
        }

        try {
          const permissions = await getMemberPermissions(
            userProfile.clanid,
            userProfile.discordid,
          );

          setHasBotPermissions(permissions.bot ?? false);
          setHasRequestPermissions(permissions.request ?? false);
          setHasKickMembersPermisssions(permissions.kickmembers ?? false);
        } catch {
          // Silent error
        }
      } catch {
        setError("errors.apiConnection");
      }
    };

    initializeComponent();
  }, [updateMembers]);

  const kickMember = async (memberdiscordid: string) => {
    if (!clanid) {
      return;
    }

    try {
      await updateMember(clanid, memberdiscordid, MemberAction.KICK);

      localStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList");
      localStorage.removeItem("memberList-lastCheck");
      sessionStorage.removeItem("memberList-lastCheck");

      setMembers(members.filter((m) => m.discordid !== memberdiscordid));
    } catch {
      setError("errors.apiConnection");
    }
  };

  const changeRequestStatus = async (action: RequestAction) => {
    setShowRequestModal(false);
    if (!requestData || !clanid) {
      return;
    }

    try {
      await updateRequest(clanid, requestData.discordid, action);

      localStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList-lastCheck");
      localStorage.removeItem("memberList-lastCheck");

      setRequestMembers(
        requestMembers.filter((m) => m.discordid !== requestData.discordid),
      );
      updateMembers();
      setRequestData(undefined);
    } catch {
      setError("errors.apiConnection");
    }
  };

  const acceptMember = async () => changeRequestStatus(RequestAction.ACCEPT);
  const rejectMember = async () => changeRequestStatus(RequestAction.REJECT);

  const handleDeleteClan = async () => {
    if (!clanid) {
      return;
    }

    try {
      await deleteClan(clanid);

      localStorage.removeItem("profile");
      sessionStorage.removeItem("profile");
      sessionStorage.removeItem("memberList-lastCheck");
      sessionStorage.removeItem("memberList");
      localStorage.removeItem("memberList");
      localStorage.removeItem("memberList-lastCheck");

      setRedirectMessage("clan.deleteSuccess");
    } catch {
      setError("errors.apiConnection");
    }
  };

  const changeOwner = async () => {
    if (!clanid || !selectNewOwner) {
      return;
    }

    try {
      await updateMember(clanid, selectNewOwner, MemberAction.OWNER);

      localStorage.removeItem("menu.profile");
      sessionStorage.removeItem("menu.profile");
      localStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList-lastCheck");
      localStorage.removeItem("memberList-lastCheck");

      setRedirectMessage("Clan updated correctly");
    } catch {
      setError("errors.apiConnection");
    }
  };

  const renderMemberList = () => {
    if (members) {
      return members?.map((member) => (
        <MemberListItem
          key={member.discordid}
          member={member}
          onKick={kickMember}
          onClickEditPermissions={(discordid: string) =>
            setMemberForEdit(discordid)
          }
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
            onShowRequest={(r: MemberRequest) => {
              setRequestData(r);
              setShowRequestModal(true);
            }}
          />
        ));
      }
      return (
        <tr>
          <td colSpan={4} className="text-center py-4 text-gray-400">
            {t("members.noPendingRequests")}
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td colSpan={4} className="text-center py-4 text-gray-400">
          {t("members.loadingRequests")}
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
              {t("clan.deleteClan")}
            </div>
            <div className="p-4 text-gray-300">{t("clan.deleteWarning")}</div>
            <div className="px-4 py-3 bg-gray-900 border-t border-gray-700">
              <button
                type="button"
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleDeleteClan}
              >
                {t("common.delete")}
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
              {t("clan.transferClan")}
            </div>
            <div className="p-4 text-gray-300">
              <p className="mb-4">{t("clan.transferWarning")}</p>
              <label
                htmlFor="selectNewOwner"
                className="block mb-2 text-sm font-medium"
              >
                {t("clan.newLeader")}
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
                {t("clan.changeLeader")}
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
          text: "errors.noPermission",
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
                {t("clan.configuration")}
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
                {t("discord.discordBotConfiguration")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 px-2 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 font-medium text-white">
              {t("members.memberList")}
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-gray-300 text-left">
                      <th className="px-4 py-2 rounded-tl-lg">
                        {t("profile.discordTag")}
                      </th>
                      <th className="px-4 py-2">{t("profile.nickInGame")}</th>
                      <th
                        className={
                          members && (isLeader || hasKickMembersPermisssions)
                            ? "px-4 py-2"
                            : "hidden"
                        }
                      >
                        {t("members.kick")}
                      </th>
                      <th
                        className={
                          members && isLeader
                            ? "px-4 py-2 rounded-tr-lg"
                            : "hidden"
                        }
                      >
                        {t("common.edit")}
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
              {t("members.requestList")}
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-gray-300 text-left">
                      <th className="px-4 py-2 rounded-tl-lg">
                        {t("profile.discordTag")}
                      </th>
                      <th className="px-4 py-2">{t("profile.nickInGame")}</th>
                      <th
                        className={
                          members && (isLeader || hasRequestPermissions)
                            ? "px-4 py-2 rounded-tr-lg"
                            : "hidden"
                        }
                      >
                        {t("trades.showRequest")}
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
            <h5 className="text-white font-medium">{t("common.request")}</h5>
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
              {t("common.accept")}
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={rejectMember}
            >
              {t("common.reject")}
            </button>
          </div>
        </div>
      </div>

      {showBotConfig && (
        <DiscordConfig
          key="discordbotconfig"
          clanid={clanid}
          onClose={() => setShowBotConfig(false)}
          onError={(error) => sendNotification(error, "common.error")}
        />
      )}
      {showClanConfig && (
        <ClanConfig
          key="clanconfig"
          clanid={clanid}
          onClose={() => setShowClanConfig(false)}
          onError={(error: string) => sendNotification(error, "common.error")}
        />
      )}
      {memberForEdit && (
        <MemberPermissionsConfig
          key="discordbotconfig"
          clanid={clanid}
          memberid={memberForEdit}
          onClose={() => setMemberForEdit(false)}
          onError={(error) => sendNotification(error, "common.error")}
        />
      )}
    </div>
  );
};

export default MemberList;
