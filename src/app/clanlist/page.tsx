"use client";

import { useState, useEffect, Fragment, useMemo, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { Helmet } from "react-helmet";
import { getStoredItem } from "@functions/services";
import { getUser } from "@functions/requests/users";
import LoadingScreen from "@components/LoadingScreen";
import ClanListItem from "@components/ClanList/ClanListItem";
import ModalMessage from "@components/ModalMessage";
import Pagination from "@components/Pagination";
import ClusterList from "@components/ClusterList";
import { getDomain } from "@functions/utils";
import { getClans } from "@functions/requests/clans";
import { sendRequest } from "@functions/requests/clans/requests";
import type { ClanInfo } from "@ctypes/dto/clan";

const ClanList = () => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [clans, setClans] = useState<ClanInfo[]>([]);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [clanRequestId, setClanRequestId] = useState(0);
  const [textAreaModelValue, setTextAreaModelValue] = useState("");
  const [clanuserid, setClanuserid] = useState<number>();
  const [isLogged, setIsLogged] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreClans, setHasMoreClans] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [regionSearch, setRegionSearch] = useState("All");

  const updateClans = useCallback(
    async (currentPage = page) => {
      setIsLoaded(false);
      setPage(currentPage);

      try {
        const data = await getClans({
          pageSize: 20,
          page: currentPage,
          ...(searchInput.length > 0 && { name: searchInput }),
          ...(regionSearch !== "All" && { region: regionSearch }),
        });

        const hasMore = data != null && data.length >= 10;
        setClans(data);
        setIsLoaded(true);
        setHasMoreClans(hasMore);
      } catch {
        setError("errors.apiConnection");
      }

      const token = getStoredItem("token");
      if (token) {
        setIsLogged(true);
        try {
          const userData = await getUser();
          setClanuserid(userData?.clanid);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("errors.apiConnection");
          }
        }
      }
    },
    [page, searchInput, regionSearch],
  );

  useEffect(() => {
    updateClans();
  }, [updateClans]);

  const handleSendRequest = async () => {
    try {
      await sendRequest(clanRequestId, textAreaModelValue);

      setRedirect(true);
    } catch {
      setError("errors.apiConnection");
    }
    setShowRequestModal(false);
    setTextAreaModelValue("");
  };

  const renderList = useMemo(() => {
    return clans.map((clan) => (
      <ClanListItem
        key={clan.clanid ?? "clan-list-item"}
        clan={clan}
        onSendRequest={(id) => {
          setClanRequestId(id);
          setShowRequestModal(true);
        }}
        clanuserid={clanuserid}
        isLogged={isLogged}
      />
    ));
  }, [clans, clanuserid, isLogged]);

  const helmetInfo = useMemo(
    () => (
      <Helmet>
        <title>Clan List - Stiletto for Last Oasis</title>
        <meta name="description" content="List of clans" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Clan List - Stiletto for Last Oasis"
        />
        <meta name="twitter:description" content="List of clans" />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/timers.jpg"
        />
        <link rel="canonical" href={`${getDomain()}/clanlist`} />
      </Helmet>
    ),
    [],
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

  if (redirect) {
    return (
      <ModalMessage
        message={{
          isError: false,
          text: "clan.applicationSent",
          redirectPage: "/profile",
        }}
      />
    );
  }

  if (!isLoaded) {
    return (
      <Fragment>
        {helmetInfo}
        <LoadingScreen />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="p-4">
        <div className="overflow-x-auto">
          {helmetInfo}
          <div className="w-full">
            <div className="bg-gray-800 border border-blue-500 rounded-lg mb-4">
              <div className="p-4 border-b border-blue-500">
                <h2 className="text-xl font-semibold text-gray-300">
                  {t("clan.searchClans")}
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="regionInput"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      {t("common.region")}
                    </label>
                    <ClusterList
                      id="regionInput"
                      value={regionSearch}
                      onChange={(value) => {
                        setPage(1);
                        setRegionSearch(value);
                      }}
                      filter={true}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label
                      htmlFor="search-name"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      {t("common.name")}
                    </label>
                    <input
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="search-name"
                      type="search"
                      placeholder="Name.."
                      aria-label="Search"
                      onChange={(evt) => {
                        setPage(1);
                        setSearchInput(evt.target.value);
                      }}
                      value={searchInput}
                    />
                  </div>
                  <div className="md:col-span-7 flex items-end space-x-2">
                    <button
                      type="button"
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => updateClans()}
                    >
                      {t("common.search")}
                    </button>
                    <button
                      type="button"
                      className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      onClick={() => {
                        setSearchInput("");
                        setRegionSearch("All");
                        updateClans();
                      }}
                    >
                      {t("common.cleanFilter")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {t("clan.clanName")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {t("common.region")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {t("clan.leader")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {t("clan.discordInviteLink")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {renderList}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={page}
              hasMore={hasMoreClans}
              onPrev={() => updateClans(page - 1)}
              onNext={() => updateClans(page + 1)}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full mx-4">
            <div className="p-4 border-b border-gray-700">
              <h5
                className="text-xl font-semibold text-gray-300"
                id="sendRequest"
              >
                {t("common.request")}
              </h5>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="modalTextArea"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  {t("common.requestMessage")}
                </label>
                <textarea
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="modalTextArea"
                  rows={3}
                  value={textAreaModelValue}
                  onChange={(evt) => setTextAreaModelValue(evt.target.value)}
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end space-x-2">
              <button
                type="button"
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => setShowRequestModal(false)}
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handleSendRequest}
              >
                {t("common.request")}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ClanList;
