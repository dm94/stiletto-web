import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { getUserProfile, getStoredItem } from "../services";
import LoadingScreen from "../components/LoadingScreen";
import ClanListItem from "../components/ClanList/ClanListItem";
import ModalMessage from "../components/ModalMessage";
import Pagination from "../components/Pagination";
import ClusterList from "../components/ClusterList";
import { getDomain } from "../functions/utils";

class ClanList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      clans: null,
      redirect: false,
      error: null,
      showRequestModal: false,
      clanRequestId: 0,
      textAreaModelValue: "",
      clanuserid: null,
      isLogged: false,
      page: 1,
      hasMoreClans: false,
      searchInput: "",
      regionSearch: "All",
    };
  }

  async componentDidMount() {
    this.updateClans();
  }

  async updateClans(page = this.state.page) {
    this.setState({ isLoaded: false, page: page });
    Axios.get(process.env.REACT_APP_API_URL + "/clans", {
      params: {
        pageSize: 20,
        page: page,
        name: this.state.searchInput.length > 0 ? this.state.searchInput : null,
        region:
          this.state.regionSearch !== "All" ? this.state.regionSearch : null,
      },
    })
      .then((response) => {
        if (response.status === 200 || response.status === 202) {
          const hasMore = response.data != null && response.data.length >= 10;
          this.setState({
            clans: response.data,
            isLoaded: true,
            hasMoreClans: hasMore,
          });
        } else if (response.status === 401) {
          this.setState({
            error: "You need to be logged in to view this section",
          });
        } else if (response.status === 503) {
          this.setState({
            error: "Error connecting to database",
          });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
    if (getStoredItem("token")) {
      this.setState({ isLogged: true });
    }

    if (getStoredItem("token")) {
      const response = await getUserProfile();
      if (response.success) {
        this.setState({ clanuserid: response.message.clanid });
      } else {
        this.setState({ error: response.message });
      }
    }
  }

  sendRequest = () => {
    const options = {
      method: "post",
      url:
        process.env.REACT_APP_API_URL +
        "/clans/" +
        this.state.clanRequestId +
        "/requests",
      params: {
        message: this.state.textAreaModelValue,
      },
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 405) {
          this.setState({
            error: "You already have a pending application to join a clan",
          });
        } else if (response.status === 503) {
          this.setState({
            error: "Error connecting to database",
          });
        } else if (response.status === 202) {
          this.setState({ redirect: true });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
    this.setState({ showRequestModal: false, textAreaModelValue: "" });
  };

  list() {
    if (this.state.clans != null) {
      return this.state.clans.map((clan) => (
        <ClanListItem
          key={clan.clanid}
          clan={clan}
          onSendRequest={(id) =>
            this.setState({ clanRequestId: id, showRequestModal: true })
          }
          clanuserid={this.state.clanuserid}
          isLogged={this.state.isLogged}
        />
      ));
    }
  }

  clanList(t) {
    if (this.state.isLoaded) {
      return (
        <div className="table-responsive">
          {this.helmetInfo()}
          <div className="col-md-12">
            <div className="card mb-3 border-primary">
              <div className="card-header">{t("Search Clans")}</div>
              <div className="card-body">
                <div className="row">
                  <div className="col-xl-2">
                    <label htmlFor="regionInput">{t("Region")}</label>
                    <ClusterList
                      onError={(error) => this.setState({ error: error })}
                      value={this.state.regionSearch}
                      onChange={(value) =>
                        this.setState({
                          page: 1,
                          regionSearch: value,
                        })
                      }
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
                      onChange={(evt) =>
                        this.setState({
                          page: 1,
                          searchInput: evt.target.value,
                        })
                      }
                      value={this.state.searchInput}
                    />
                  </div>
                  <div className="col-2 btn-group">
                    <button
                      className="btn btn-primary"
                      onClick={() => this.updateClans()}
                    >
                      {t("Search")}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        this.setState(
                          {
                            searchInput: "",
                            regionSearch: "All",
                          },
                          () => this.updateClans()
                        );
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
            <tbody>{this.list()}</tbody>
          </table>
          <Pagination
            currentPage={this.state.page}
            hasMore={this.state.hasMoreClans}
            onPrev={() => this.updateClans(this.state.page - 1)}
            onNext={() => this.updateClans(this.state.page + 1)}
          ></Pagination>
        </div>
      );
    } else {
      return (
        <Fragment>
          {this.helmetInfo()}
          <LoadingScreen />
        </Fragment>
      );
    }
  }

  helmetInfo() {
    return (
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
        <link
          rel="canonical"
          href={
            getDomain() +
            "/clanlist"
          }
        />
      </Helmet>
    );
  }

  render() {
    const { t } = this.props;
    if (this.state.error) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: this.state.error,
            redirectPage: "/profile",
          }}
        />
      );
    } else if (this.state.redirect) {
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

    const showHideClassName = this.state.showRequestModal
      ? "modal d-block"
      : "modal d-none";
    return (
      <Fragment>
        {this.clanList(t)}
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
                    value={this.state.textAreaModelValue}
                    onChange={(evt) =>
                      this.setState({
                        textAreaModelValue: evt.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => this.setState({ showRequestModal: false })}
                >
                  {t("Cancel")}
                </button>
                <button className="btn btn-success" onClick={this.sendRequest}>
                  {t("Send request")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withTranslation()(ClanList);
