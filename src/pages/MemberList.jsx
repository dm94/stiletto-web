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
import { config } from "../config/config";
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
  const [members, setMembers] = useState(false);
  const [requestMembers, setRequestMembers] = useState(false);
  const [error, setError] = useState(false);
  const [isLoadedRequestList, setIsLoadedRequestList] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState(false);
  const [selectNewOwner, setSelectNewOwner] = useState(
    getStoredItem("discordid")
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
          userProfile.message.discordid === userProfile.message.leaderid
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
      return false;
    }

    try {
      const response = await updateMember(
        clanid,
        requestData.discordid,
        "accept"
      );

      localStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList-lastCheck");
      localStorage.removeItem("memberList-lastCheck");

      if (response.status === 202) {
        setRequestMembers(
          requestMembers.filter((m) => m.discordid !== requestData.discordid)
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
      return false;
    }

    try {
      const response = await updateMember(
        clanid,
        requestData.discordid,
        "reject"
      );

      localStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList");
      sessionStorage.removeItem("memberList-lastCheck");
      localStorage.removeItem("memberList-lastCheck");

      if (response.status === 202) {
        setRequestMembers(
          requestMembers.filter((m) => m.discordid !== requestData.discordid)
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
      const response = await fetch(
        `${config.REACT_APP_API_URL}/clans/${clanid}/members/${selectNewOwner}?action=owner`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
        }
      );

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
      return members.map((member) => (
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
          <td colSpan="4" className="text-center">
            {t("There are no pending requests")}
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td colSpan="4" className="text-center">
          {t("Loading the list of requests to enter the clan")}
        </td>
      </tr>
    );
  };

  const renderDeleteClanButton = () => {
    if (members && isLeader) {
      return (
        <div className="col-xl-3">
          <div className="card mb-3">
            <div className="card-header">{t("Delete Clan")}</div>
            <div className="card-body">
              {t(
                "By deleting the clan you will delete all the data linked to it, be careful because this option is not reversible"
              )}
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="btn btn-block btn-danger"
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
        <div className="col-xl-3">
          <div className="card mb-3">
            <div className="card-header">{t("Transfer Clan")}</div>
            <div className="card-body">
              <p>
                {t(
                  "This option is not reversible, so be careful who you pass it on to in the leadership of the clan"
                )}
              </p>
              <label htmlFor="selectNewOwner">{t("New leader:")}</label>
              <select
                id="selectNewOwner"
                className="custom-select"
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
            <div className="card-footer">
              <button
                type="button"
                className="btn btn-block btn-danger"
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

  const showHideClassName = showRequestModal ? "modal d-block" : "modal d-none";

  return (
    <div className="row">
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
      <div
        className={isLeader || hasBotPermissions ? "col-12" : "col-12 d-none"}
      >
        <div className="row">
          <div className={isLeader ? "col-12 col-lg-2 mr-auto mb-2" : "d-none"}>
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-primary" disabled>
                <i className="fas fa-users-cog" />
              </button>
              <button
                type="button"
                className="btn btn-info"
                onClick={() => setShowClanConfig(true)}
              >
                {t("Clan Configuration")}
              </button>
            </div>
          </div>
          <div className="col-12 col-lg-2 ml-auto mb-2">
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-primary" disabled>
                <i className="fab fa-discord" />
              </button>
              <button
                type="button"
                className={
                  isLeader || hasBotPermissions ? "btn btn-info" : "d-none"
                }
                onClick={() => setShowBotConfig(true)}
              >
                {t("Discord Bot Configuration")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-6">
        <div className="card mb-3">
          <div className="card-header">{t("Member List")}</div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center" scope="col">
                    {t("Discord Tag")}
                  </th>
                  <th className="text-center" scope="col">
                    {t("Nick in Game")}
                  </th>
                  <th
                    className={
                      members && (isLeader || hasKickMembersPermisssions)
                        ? "text-center"
                        : "d-none"
                    }
                    scope="col"
                  >
                    {t("Kick")}
                  </th>
                  <th
                    className={members && isLeader ? "text-center" : "d-none"}
                    scope="col"
                  >
                    {t("Edit")}
                  </th>
                </tr>
              </thead>
              <tbody>{renderMemberList()}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="col-xl-6">
        <div className="card mb-3">
          <div className="card-header">{t("List of requests")}</div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center" scope="col">
                    {t("Discord Tag")}
                  </th>
                  <th className="text-center" scope="col">
                    {t("Nick in Game")}
                  </th>
                  <th
                    className={
                      members && (isLeader || hasRequestPermissions)
                        ? "text-center"
                        : "d-none"
                    }
                    scope="col"
                  >
                    {t("Show request")}
                  </th>
                </tr>
              </thead>
              <tbody>{renderRequestList()}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={showHideClassName}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="sendRequest">
                {t("Request")}
              </h5>
            </div>
            <div className="modal-body">
              {requestData ? requestData.message : ""}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-block btn-success"
                onClick={acceptMember}
              >
                {t("Accept")}
              </button>
              <button
                type="button"
                className="btn btn-block btn-danger"
                onClick={rejectMember}
              >
                {t("Reject")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {renderTransferOwnerPanel()}
      {renderDeleteClanButton()}
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
