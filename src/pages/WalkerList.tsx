import type React from "react";
import { useState, useEffect, Fragment, useCallback, useMemo } from "react";
import ModalMessage from "@components/ModalMessage";
import LoadingScreen from "@components/LoadingScreen";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getItems } from "@functions/services";
import { useUser } from "@store/userStore";
import Pagination from "@components/Pagination";
import WalkerListItem from "@components/WalkerList/WalkerListItem";
import { getDomain } from "@functions/utils";
import {
  getWalkers,
  editWalker,
  deleteWalker,
} from "@functions/requests/walkers";
import { WalkerEnum, type WalkerInfo, WalkerUse } from "@ctypes/dto/walkers";
import type { Item } from "@ctypes/item";
import { getUser } from "@functions/requests/users";
import {
  getMemberPermissions,
  getMembers,
} from "@functions/requests/clans/members";
import type { MemberInfo } from "@ctypes/dto/members";

const WalkerList: React.FC = () => {
  const { t } = useTranslation();
  const { isConnected } = useUser();
  const [isLoaded, setIsLoaded] = useState(false);
  const [walkers, setWalkers] = useState<WalkerInfo[]>([]);
  const [error, setError] = useState("");
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [walkerTypes, setWalkerTypes] = useState<string[]>([]);
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [hasMoreWalkers, setHasMoreWalkers] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [walkerTypeSearch, setWalkerTypeSearch] = useState("All");
  const [searchDescription, setSearchDescription] = useState<string>("");
  const [useWalkerSearch, setUseWalkerSearch] = useState("All");
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [isReadySearch, setIsReadySearch] = useState<string>("All");
  const [clanId, setClanId] = useState<number>();

  const updateWalkers = useCallback(
    async (currentPage = page) => {
      setIsLoaded(false);
      setPage(currentPage);

      try {
        const response = await getWalkers({
          pageSize: 20,
          page: currentPage,
          ...(searchInput && { name: searchInput }),
          ...(walkerTypeSearch !== "All" && {
            type: walkerTypeSearch as WalkerEnum,
          }),
          ...(searchDescription && { desc: searchDescription }),
          ...(useWalkerSearch !== "All" && {
            use: useWalkerSearch as WalkerUse,
          }),
          ...(isReadySearch !== "All" && { ready: isReadySearch === "Yes" }),
        });

        const hasMore = response && response.length >= 20;
        setWalkers(response);
        setHasMoreWalkers(hasMore);
      } catch {
        setError(t("errors.apiConnection"));
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
      t,
    ],
  );

  const updateWalker = useCallback(
    async (walker: WalkerInfo) => {
      try {
        await editWalker(String(walker.walkerid), {
          owner: walker.ownerUser ?? "",
          use: walker.use ?? WalkerUse.PERSONAL,
          type: walker.type ?? WalkerEnum.STILETTO,
          description: walker.description ?? "",
          ready: walker.isReady,
        });

        await updateWalkers();
      } catch {
        setError(t("errors.apiConnection"));
      }
    },
    [updateWalkers, t],
  );

  const handleDeleteWalker = useCallback(
    async (walkerId: number) => {
      try {
        await deleteWalker(String(walkerId));
        await updateWalkers();
      } catch {
        setError(t("errors.apiConnection"));
      }
    },
    [updateWalkers, t],
  );

  const setupUserProfile = useCallback(async () => {
    let userIsLeader = false;
    let clan: number | undefined;
    let discordId: string | undefined;

    try {
      const data = await getUser();
      if (!data) {
        setIsLoaded(true);
        return false;
      }

      const { discordid, leaderid, clanid, nickname } = data;
      userIsLeader = discordid === leaderid;
      clan = clanid;
      discordId = discordid;

      setIsLeader(userIsLeader);
      setClanId(clanid);
      setNickname(nickname);
      setHasPermissions(userIsLeader);
    } catch {
      setError(t("errors.apiConnection"));
      setIsLoaded(true);
      return false;
    }

    try {
      if (!userIsLeader && clan && discordId) {
        const response = await getMemberPermissions(clan, discordId);
        setHasPermissions(response.walkers ?? false);
      }
    } catch {
      // Silent error - permissions default to leader status
    }

    return true;
  }, [t]);

  const loadMembersAndItems = useCallback(async () => {
    if (!clanId) {
      return;
    }

    try {
      const membersResponse = await getMembers(clanId);
      setMembers(membersResponse);

      const itemsResponse = await getItems();
      if (itemsResponse) {
        const walkerTypeList = itemsResponse
          .filter((item: Item) => item.category === "Walkers")
          .map((item: Item) => item.name.replace("Walker", "").trim());
        setWalkerTypes(walkerTypeList);
      }
    } catch {
      setError(t("errors.apiConnection"));
    }
  }, [clanId, t]);

  useEffect(() => {
    const initializeData = async () => {
      if (!isConnected) {
        setError(t("errors.loginRequired"));
        return;
      }

      const profileSuccess = await setupUserProfile();
      if (!profileSuccess) {
        return;
      }

      await loadMembersAndItems();
      await updateWalkers();
    };

    initializeData();
  }, [updateWalkers, setupUserProfile, loadMembersAndItems, t, isConnected]);

  const renderWalkerList = useMemo(() => {
    if (!walkers) {
      return "";
    }

    return walkers.map((walker) => (
      <WalkerListItem
        key={`witem${walker.walkerid}`}
        walker={walker}
        walkerListTypes={walkerTypes}
        memberList={members}
        isLeader={isLeader ?? hasPermissions}
        nickname={nickname ?? ""}
        onRemove={handleDeleteWalker}
        onSave={updateWalker}
      />
    ));
  }, [
    walkers,
    walkerTypes,
    members,
    isLeader,
    hasPermissions,
    nickname,
    handleDeleteWalker,
    updateWalker,
  ]);

  const renderWalkerOptionList = useMemo(() => {
    if (!walkerTypes) {
      return "";
    }

    return walkerTypes.map((walker) => (
      <option key={walker} value={walker}>
        {t(walker)}
      </option>
    ));
  }, [walkerTypes, t]);

  const renderServerLinkButton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="text-blue-400 mb-3">
            {t("walkers.discordLinkNotice")}
          </div>
          <div className="text-yellow-400">
            {t(
              "You can link the discord server more easily by typing /linkserver in your discord server when you have added the bot.",
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
        <h2 className="text-lg font-semibold text-gray-300">
          {t("discord.bot")}
        </h2>
      </div>
      <div className="p-4">
        <div className="mb-3 text-gray-300">{t("discord.botDescription")}</div>
        <a
          className="w-full inline-flex justify-center items-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          href="https://top.gg/bot/715948052979908911"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("discord.bot")}
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
          text: t("errors.noClan"),
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
          <h2 className="text-lg font-semibold text-gray-300">
            {t("walkers.searchWalkers")}
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label
                htmlFor="walkerTypeSearch"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("common.type")}
              </label>
              <select
                id="walkerTypeSearch"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={walkerTypeSearch || "All"}
                onChange={(e) => setWalkerTypeSearch(e.target.value)}
              >
                <option value="All">{t("common.all")}</option>
                {renderWalkerOptionList}
              </select>
            </div>
            <div>
              <label
                htmlFor="search-name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("common.name")}
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
              <label
                htmlFor="useWalkerSearch"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("common.use")}
              </label>
              <select
                id="useWalkerSearch"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={useWalkerSearch || "All"}
                onChange={(e) => setUseWalkerSearch(e.target.value)}
              >
                <option value="All">{t("common.all")}</option>
                <option value="Personal">{t("common.personal")}</option>
                <option value="PVP">{t("common.pvp")}</option>
                <option value="Farming">{t("common.farming")}</option>
                <option value="RAM">{t("RAM")}</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="search-description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("common.description")}
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
              <label
                htmlFor="isReadySearch"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("common.isReady")}
              </label>
              <select
                id="isReadySearch"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={isReadySearch || "All"}
                onChange={(e) => setIsReadySearch(e.target.value)}
              >
                <option value="All">{t("common.all")}</option>
                <option value="Yes">{t("common.yes")}</option>
                <option value="No">{t("common.no")}</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => updateWalkers()}
                >
                  {t("walkers.filterWalkers")}
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
                  {t("common.cleanFilter")}
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
                {t("common.type")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("common.name")}
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("common.use")}
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("common.description")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("common.ready")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                {t("common.view")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {renderWalkerList}
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
