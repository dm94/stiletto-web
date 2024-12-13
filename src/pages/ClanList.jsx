import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { getUserProfile, getStoredItem } from "../services";
import LoadingScreen from "../components/LoadingScreen";
import ClanListItem from "../components/ClanList/ClanListItem";
import ModalMessage from "../components/ModalMessage";
import Pagination from "../components/Pagination";
import ClusterList from "../components/ClusterList";
import { getDomain } from "../functions/utils";
import { getClans } from "../functions/requests/clan";
import { sendRequest } from "../functions/requests/clans/requests";

const ClanList = () => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [clans, setClans] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [clanRequestId, setClanRequestId] = useState(0);
  const [textAreaModelValue, setTextAreaModelValue] = useState("");
  const [clanuserid, setClanuserid] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreClans, setHasMoreClans] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [regionSearch, setRegionSearch] = useState("All");

  useEffect(() => {
    updateClans();
  }, []);

  const updateClans = async (currentPage = page) => {
    setIsLoaded(false);
    setPage(currentPage);

    try {
      const response = await getClans({
        pageSize: 20,
        page: currentPage,
        ...(searchInput.length > 0 && { name: searchInput }),
        ...(regionSearch !== "All" && { region: regionSearch }),
      });

      if (response.ok) {
        const data = await response.json();
        const hasMore = data != null && data.length >= 10;
        setClans(data);
        setIsLoaded(true);
        setHasMoreClans(hasMore);
      } else if (response.status === 401) {
        setError("You need to be logged in to view this section");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      }
    } catch {
      setError("Error when connecting to the API");
    }

    const token = getStoredItem("token");
    if (token) {
      setIsLogged(true);
      const response = await getUserProfile();
      if (response.success) {
        setClanuserid(response.message.clanid);
      } else {
        setError(response.message);
      }
    }
  };

  const handleSendRequest = async () => {
    try {
      const response = await sendRequest(clanRequestId, textAreaModelValue);

      if (response.status === 405) {
        setError("You already have a pending application to join a clan");
      } else if (response.status === 503) {
        setError("Error connecting to database");
      } else if (response.status === 202) {
        setRedirect(true);
      }
    } catch {
      setError("Error when connecting to the API");
    }
    setShowRequestModal(false);
    setTextAreaModelValue("");
  };

  const renderList = () => {
    if (!clans) {
      return "";
    }

    return clans.map((clan) => (
      <ClanListItem
        key={clan.clanid}
        clan={clan}
        onSendRequest={(id) => {
          setClanRequestId(id);
          setShowRequestModal(true);
        }}
        clanuserid={clanuserid}
        isLogged={isLogged}
      />
    ));
  };

  const helmetInfo = () => (
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
          text: "Application to enter the clan sent",
          redirectPage: "/profile",
        }}
      />
    );
  }

  const showHideClassName = showRequestModal ? "modal d-block" : "modal d-none";

  if (!isLoaded) {
    return (
      <Fragment>
        {helmetInfo()}
        <LoadingScreen />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="table-responsive">
        {helmetInfo()}
        <div className="col-md-12">
          <div className="card mb-3 border-primary">
            <div className="card-header">{t("Search Clans")}</div>
            <div className="card-body">
              <div className="row">
                <div className="col-xl-2">
                  <label htmlFor="regionInput">{t("Region")}</label>
                  <ClusterList
                    onError={setError}
                    value={regionSearch}
                    onChange={(value) => {
                      setPage(1);
                      setRegionSearch(value);
                    }}
                    filter={true}
                  />
                </div>
                <div className="col-xl-3">
                  <label htmlFor="search-name">{t("Name")}</label>
                  <input
                    className="form-control"
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
                <div className="col-2 btn-group">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => updateClans()}
                  >
                    {t("Search")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchInput("");
                      setRegionSearch("All");
                      updateClans();
                    }}
                  >
                    {t("Clean filter")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table className="table table-striped">
          <thead className="thead-light">
            <tr>
              <th scope="col">{t("Clan Name")}</th>
              <th scope="col">{t("Region")}</th>
              <th scope="col">{t("Leader")}</th>
              <th scope="col">{t("Discord Invite Link")}</th>
              <th className="text-center" scope="col">
                {t("Actions")}
              </th>
            </tr>
          </thead>
          <tbody>{renderList()}</tbody>
        </table>
        <Pagination
          currentPage={page}
          hasMore={hasMoreClans}
          onPrev={() => updateClans(page - 1)}
          onNext={() => updateClans(page + 1)}
        />
      </div>
      <div className={showHideClassName}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="sendRequest">
                {t("Send request")}
              </h5>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="modalTextArea">{t("Request message")}</label>
                <textarea
                  className="form-control bg-light"
                  id="modalTextArea"
                  rows="3"
                  value={textAreaModelValue}
                  onChange={(evt) => setTextAreaModelValue(evt.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRequestModal(false)}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSendRequest}
              >
                {t("Send request")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ClanList;
