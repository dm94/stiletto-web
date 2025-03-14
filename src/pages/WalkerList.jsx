import React, { useState, useEffect, Fragment, useCallback } from "react";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import queryString from "query-string";
import {
  getItems,
  getUserProfile,
  getHasPermissions,
  getStoredItem,
  getCachedMembers,
} from "../functions/services";
import Pagination from "../components/Pagination";
import WalkerListItem from "../components/WalkerList/WalkerListItem";
import { getDomain } from "../functions/utils";
import {
  getWalkers,
  editWalker,
  getDiscordServers,
  deleteWalker,
} from "../functions/requests/walkers";

const WalkerList = (props) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [walkers, setWalkers] = useState([]);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [walkerTypes, setWalkerTypes] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [nickname, setNickname] = useState("");
  const [page, setPage] = useState(1);
  const [hasMoreWalkers, setHasMoreWalkers] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [walkerTypeSearch, setWalkerTypeSearch] = useState("All");
  const [searchDescription, setSearchDescription] = useState("");
  const [useWalkerSearch, setUseWalkerSearch] = useState("All");
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isReadySearch, setIsReadySearch] = useState("All");
  const [clanId, setClanId] = useState("");

  const updateWalkers = useCallback(
    async (currentPage = page) => {
      setIsLoaded(false);
      setPage(currentPage);

      try {
        const response = await getWalkers({
          pageSize: "20",
          page: currentPage.toString(),
          ...(searchInput && { name: searchInput }),
          ...(walkerTypeSearch !== "All" && { type: walkerTypeSearch }),
          ...(searchDescription && { desc: searchDescription }),
          ...(useWalkerSearch !== "All" && { use: useWalkerSearch }),
          ...(isReadySearch !== "All" && { ready: isReadySearch === "Yes" }),
        });

        if (response.ok) {
          const data = await response.json();
          const hasMore = data && data.length >= 20;
          setWalkers(data);
          setHasMoreWalkers(hasMore);
        } else if (response.status === 401) {
          setError("The data entered is incorrect");
        } else if (response.status === 503) {
          setError("Error connecting to database");
        }
      } catch {
        setError("Error when connecting to the API");
      }
      setIsLoaded(true);
    },
    [
      page,
      searchInput,
      walkerTypeSearch,
      searchDescription,
      useWalkerSearch,
      isReadySearch,
    ]
  );

  const updateWalker = async (walker) => {
    try {
      const response = await editWalker({
        walkerID: walker.walkerID,
        owner: walker.ownerUser,
        use: walker.walker_use,
        type: walker.type,
        description: walker.description,
        ready: walker.isReady,
      });

      if (response.status === 202) {
        updateWalkers();
      } else if (response.status === 401) {
        setError("Unauthorized");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("Error when connecting to the API");
    }
  };

  const handleDeleteWalker = async (walkerId) => {
    try {
      const response = await deleteWalker(walkerId);

      if (response.status === 204) {
        updateWalkers();
      } else if (response.status === 401) {
        setError("Unauthorized");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("Error when connecting to the API");
    }
  };

  useEffect(() => {
    const handleDiscordAuth = async (code) => {
      try {
        const response = await getDiscordServers(
          code,
          `${getDomain()}/walkerlist`
        );
        if (response.status === 401) {
          setError("Unauthorized");
        } else if (response.status === 503) {
          setError("Error connecting to database");
        }
      } catch {
        setError("Error when connecting to the API");
      }
    };

    const setupUserProfile = async () => {
      const response = await getUserProfile();
      if (!response.success) {
        setError(response.message);
        setIsLoaded(true);
        return false;
      }

      const { discordid, leaderid, clanid, nickname } = response.message;
      const userIsLeader = discordid === leaderid;

      setIsLeader(userIsLeader);
      setClanId(clanid);
      setNickname(nickname);
      setHasPermissions(userIsLeader || (await getHasPermissions("walkers")));

      return true;
    };

    const loadMembersAndItems = async () => {
      const [membersResponse, itemsResponse] = await Promise.all([
        getCachedMembers(),
        getItems(),
      ]);

      if (membersResponse.success) {
        setMembers(membersResponse.message);
      } else {
        setError(membersResponse.message);
      }

      if (itemsResponse) {
        const walkerTypeList = itemsResponse
          .filter((item) => item.category === "Walkers")
          .map((item) => item.name.replace("Walker", "").trim());
        setWalkerTypes(walkerTypeList);
      }
    };

    const initializeData = async () => {
      if (!getStoredItem("token")) {
        setError("You need to be logged in to view this section");
        return;
      }

      const parsed = queryString.parse(props?.location.search);
      if (parsed.code) {
        await handleDiscordAuth(parsed.code);
      }

      const profileSuccess = await setupUserProfile();
      if (!profileSuccess) {
        return;
      }

      await loadMembersAndItems();
      await updateWalkers();
    };

    initializeData();
  }, [props?.location.search, updateWalkers]);

  const renderWalkerList = () => {
    if (!walkers) {
      return "";
    }

    return walkers.map((walker) => (
      <WalkerListItem
        key={`witem${walker.walkerID}`}
        walker={walker}
        walkerListTypes={walkerTypes}
        memberList={members}
        isLeader={isLeader || hasPermissions}
        nickname={nickname}
        onRemove={handleDeleteWalker}
        onSave={updateWalker}
      />
    ));
  };

  const renderWalkerOptionList = () => {
    if (!walkerTypes) {
      return "";
    }

    return walkerTypes.map((walker) => (
      <option key={walker} value={walker}>
        {t(walker)}
      </option>
    ));
  };

  const renderServerLinkButton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="text-blue-400 mb-3">
            {t(
              "For the walkers to appear it is necessary to link the discord server with the clan, only users with administration power can add the discord server."
            )}
          </div>
          <div className="text-yellow-400">
            {t(
              "You can link the discord server more easily by typing /linkserver in your discord server when you have added the bot."
            )}
          </div>
        </div>
      </div>
      {renderDiscordBotSection()}
    </div>
  );

  const renderDiscordBotSection = () => (
    <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-900 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-300">{t("Discord Bot")}</h2>
      </div>
      <div className="p-4">
        <div className="mb-3 text-gray-300">
          {t(
            "You need to add the bot to your discord to compile the list of walkers from the log, but it also has other functions like checking what you need to do the different items"
          )}
        </div>
        <a
          className="w-full inline-flex justify-center items-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          href="https://top.gg/bot/715948052979908911"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("Discord Bot")}
        </a>
      </div>
    </div>
  );

  const renderHelmetInfo = () => (
    <Helmet>
      <title>Clan Walker List - Stiletto for Last Oasis</title>
      <meta
        name="description"
        content="This is the list of all the walkers of your clan"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Walker List - Stiletto for Last Oasis"
      />
      <meta
        name="twitter:description"
        content="This is the list of all the walkers of your clan"
      />
      <meta
        name="twitter:image"
        content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/walkersList.png"
      />
      <link rel="canonical" href={`${getDomain()}/walkerlist`} />
    </Helmet>
  );

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

  if (!clanId) {
    return (
      <ModalMessage
        message={{
          isError: true,
          text: "You need to have a clan to access this section",
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (!isLoaded) {
    return (
      <Fragment>
        {renderHelmetInfo()}
        <LoadingScreen />
      </Fragment>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {renderHelmetInfo()}
      {renderServerLinkButton()}
      
      <div className="bg-gray-800 border border-blue-500 rounded-lg shadow-md mb-6">
        <div className="p-3 bg-gray-900 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-300">{t("Search Walkers")}</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label htmlFor="walkerTypeSearch" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Type")}
              </label>
              <select
                id="walkerTypeSearch"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={walkerTypeSearch || "All"}
                onChange={(e) => setWalkerTypeSearch(e.target.value)}
              >
                <option value="All">{t("All")}</option>
                {renderWalkerOptionList()}
              </select>
            </div>
            <div>
              <label htmlFor="search-name" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Name")}
              </label>
              <input
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="search-name"
                type="search"
                placeholder="Name.."
                aria-label="Search"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
              />
            </div>
            <div>
              <label htmlFor="useWalkerSearch" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Use")}
              </label>
              <select
                id="useWalkerSearch"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={useWalkerSearch || "All"}
                onChange={(e) => setUseWalkerSearch(e.target.value)}
              >
                <option value="All">{t("All")}</option>
                <option value="Personal">{t("Personal")}</option>
                <option value="PVP">{t("PVP")}</option>
                <option value="Farming">{t("Farming")}</option>
                <option value="RAM">{t("RAM")}</option>
              </select>
            </div>
            <div>
              <label htmlFor="search-description" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Description")}
              </label>
              <input
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="search-description"
                type="search"
                aria-label="Search"
                onChange={(e) => setSearchDescription(e.target.value)}
                value={searchDescription}
              />
            </div>
            <div>
              <label htmlFor="isReadySearch" className="block text-sm font-medium text-gray-300 mb-1">
                {t("Is ready?")}
              </label>
              <select
                id="isReadySearch"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={isReadySearch || "All"}
                onChange={(e) => setIsReadySearch(e.target.value)}
              >
                <option value="All">{t("All")}</option>
                <option value="Yes">{t("Yes")}</option>
                <option value="No">{t("No")}</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => updateWalkers()}
                >
                  {t("Filter walkers")}
                </button>
                <button
                  type="button"
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => {
                    setSearchInput("");
                    setWalkerTypeSearch("All");
                    setSearchDescription("");
                    setUseWalkerSearch("All");
                    updateWalkers();
                  }}
                >
                  {t("Clean filter")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("Type")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("Name")}
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("Use")}
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("Description")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("Ready")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("View")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {renderWalkerList()}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <Pagination
          currentPage={page}
          hasMore={hasMoreWalkers}
          onPrev={() => updateWalkers(page - 1)}
          onNext={() => updateWalkers(page + 1)}
        />
      </div>
    </div>
  );
};

export default WalkerList;
