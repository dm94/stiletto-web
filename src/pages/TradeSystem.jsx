import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { getItems, getStoredItem } from "../services";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import Pagination from "../components/Pagination";
import Trade from "../components/TradeSystem/Trade";
import ClusterList from "../components/ClusterList";
import { getDomain } from "../functions/utils";

class TradeSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: getStoredItem("discordid"),
      token: getStoredItem("token"),
      isLoaded: false,
      trades: null,
      error: null,
      items: null,
      resourceTypeInput: "Aloe Vera",
      tradeTypeInput: "Supply",
      amountInput: 0,
      regionInput: "EU",
      qualityInput: 0,
      priceInput: 0,
      filteredTrades: [],
      resourceTypeFilterInput: null,
      tradeTypeFilterInput: null,
      regionFilterInput: null,
      page: 1,
      hasMore: false,
    };
  }

  componentDidMount() {
    this.updateRecipes();
    this.updateTrades();
  }

  updateTrades(page = this.state.page) {
    this.setState({ isLoaded: false, page: page });
    Axios.get(process.env.REACT_APP_API_URL + "/trades", {
      params: {
        pageSize: 10,
        page: page,
        type: this.state.tradeTypeFilterInput,
        resource: this.state.resourceTypeFilterInput,
        region: this.state.regionFilterInput,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          const hasMore = response.data != null && response.data.length >= 10;
          this.setState({
            trades: response.data,
            isLoaded: true,
            hasMore: hasMore,
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error connecting to the API" });
      });
  }

  async updateRecipes() {
    let items = await getItems();
    if (items != null) {
      items = items.filter(
        (it) =>
          it.category === "Resources" ||
          it.category === "Ammo" ||
          it.category === "Armors" ||
          it.category === "Grappling Hooks" ||
          it.category === "Schematics" ||
          it.category === "Tools" ||
          it.category === "Liquids" ||
          it.name === "Sterile Bandage" ||
          it.name === "Primitive Bandage"
      );
      this.setState({ items: items });
    }
  }

  deleteTrade = (idTrade) => {
    const options = {
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/trades/" + idTrade,
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    };

    Axios.request(options).then((response) => {
      if (response.status === 204) {
        this.componentDidMount();
      } else if (response.status === 401) {
        this.setState({ error: "Unauthorized" });
      } else if (response.status === 503) {
        this.setState({ error: "Error connecting to database" });
      }
    });
  };

  createTrade = (event) => {
    event.preventDefault();
    const options = {
      method: "post",
      url: process.env.REACT_APP_API_URL + "/trades",
      params: {
        resource: this.state.resourceTypeInput,
        type: this.state.tradeTypeInput,
        amount: this.state.amountInput,
        region: this.state.regionInput,
        quality: this.state.qualityInput,
        price: this.state.priceInput,
      },
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        this.setState({
          resourceTypeInput: "Aloe Vera",
          tradeTypeInput: "Supply",
          amountInput: 0,
          regionInput: "EU",
          qualityInput: 0,
        });
        if (response.status === 201) {
          this.componentDidMount();
        } else if (response.status === 400) {
          this.setState({ error: "Some data are missing" });
        } else if (response.status === 401) {
          this.setState({ error: "These connection data are wrong" });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Try again later" });
      });
  };

  loggedPart(t) {
    if (this.state.user_discord_id == null || this.state.token == null) {
      return (
        <div className="col-xl-6">
          <div className="card border-secondary mb-3">
            <div className="card-body text-succes">
              {t(
                "If you want to publish your own exchange offers you have to be connected"
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-xl-12">
          <form onSubmit={this.createTrade}>
            <div className="card border-secondary mb-3">
              <div className="card-header">{t("Publish a trade")}</div>
              <div className="card-body">
                <div className="row">
                  <div className="form-group col-xl-2">
                    <label htmlFor="tradeType">{t("Type")}</label>
                    <select
                      id="tradeType"
                      className="custom-select"
                      value={this.state.tradeTypeInput}
                      onChange={(evt) =>
                        this.setState({
                          tradeTypeInput: evt.target.value,
                        })
                      }
                    >
                      <option value="Supply">{t("Supply")}</option>
                      <option value="Demand">{t("Demand")}</option>
                    </select>
                  </div>
                  <div className="form-group col-xl-2">
                    <label htmlFor="resourcetype">
                      {t("Resource or mats for")}
                    </label>
                    <select
                      id="resourcetype"
                      className="custom-select"
                      value={this.state.resourceTypeInput}
                      onChange={(evt) =>
                        this.setState({
                          resourceTypeInput: evt.target.value,
                        })
                      }
                    >
                      {this.resourcesList(t)}
                    </select>
                  </div>
                  <div className="form-group col-xl-2">
                    <label htmlFor="regionInput">{t("Region")}</label>
                    <ClusterList
                      onError={(error) => this.setState({ error: error })}
                      value={this.state.regionInput}
                      onChange={(value) =>
                        this.setState({
                          regionInput: value,
                        })
                      }
                      filter={false}
                    />
                  </div>
                  <div className="form-group col-xl-2">
                    <label htmlFor="amountInput">{t("Quantity")}</label>
                    <input
                      type="number"
                      id="amountInput"
                      className="form-control"
                      value={this.state.amountInput}
                      min="0"
                      onChange={(evt) =>
                        this.setState({
                          amountInput: evt.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group col-xl-2">
                    <label htmlFor="qualityInput">{t("Quality")}</label>
                    <select
                      id="qualityInput"
                      type="range"
                      className="custom-select"
                      value={this.state.qualityInput}
                      onChange={(evt) =>
                        this.setState({
                          qualityInput: evt.target.value,
                        })
                      }
                    >
                      <option value="0">{t("Common")}</option>
                      <option value="1">{t("Uncommon")}</option>
                      <option value="2">{t("Rare")}</option>
                      <option value="3">{t("Epic")}</option>
                      <option value="4">{t("Legendary")}</option>
                    </select>
                  </div>
                  <div className="form-group col-xl-2">
                    <label htmlFor="priceInput">{t("Price per unit")}</label>
                    <input
                      id="priceInput"
                      type="number"
                      className="form-control"
                      min="0"
                      value={this.state.priceInput}
                      onChange={(evt) =>
                        this.setState({
                          priceInput: evt.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group col-xl-12">
                    <button
                      className="btn btn-lg btn-success btn-block"
                      type="submit"
                      value="Submit"
                    >
                      {t("Publish")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      );
    }
  }

  resourcesList(t) {
    if (this.state.items != null) {
      return this.state.items.map((item) => (
        <option key={item.name} value={item.name}>
          {t(item.name, { ns: "items" })}
        </option>
      ));
    }
  }

  tradeList() {
    if (!this.state.isLoaded) {
      return <LoadingScreen />;
    }
    if (this.state.trades != null) {
      return this.state.trades.map((trade) => (
        <Trade
          key={"trade" + trade.idtrade}
          trade={trade}
          onDelete={this.deleteTrade}
        />
      ));
    }
  }

  helmetInfo() {
    return (
      <Helmet>
        <title>Trades - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="Publish your trade offers or what you need to make it easy for others to trade with you"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trades - Stiletto for Last Oasis" />
        <meta
          name="twitter:description"
          content="Publish your trade offers or what you need to make it easy for others to trade with you"
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/dm94/stiletto-web/master/design/trades.jpg"
        />
        <link
          rel="canonical"
          href={
            getDomain() +
            "/trades"
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
    }

    return (
      <div className="row">
        {this.helmetInfo()}
        {this.loggedPart(t)}
        <div className="col-md-12">
          <div className="card mb-3 border-primary">
            <div className="card-header">{t("Published Trades")}</div>
            <div className="card-body">
              <div className="row">
                <div className="col-1">
                  <label htmlFor="tradeTypeFilter">{t("Type")}</label>
                </div>
                <div className="col-xl-2">
                  <select
                    id="tradeTypeFilter"
                    className="custom-select"
                    value={
                      this.state.tradeTypeFilterInput
                        ? this.state.tradeTypeFilterInput
                        : ""
                    }
                    onChange={(evt) =>
                      this.setState({
                        tradeTypeFilterInput: evt.target.value,
                      })
                    }
                  >
                    <option value="Supply">{t("Supply")}</option>
                    <option value="Demand">{t("Demand")}</option>
                  </select>
                </div>
                <div className="col-1">
                  <label htmlFor="resourcetypefilter">{t("Resource")}</label>
                </div>
                <div className="col-xl-2">
                  <select
                    id="resourcetypefilter"
                    className="custom-select"
                    value={
                      this.state.resourceTypeFilterInput
                        ? this.state.resourceTypeFilterInput
                        : ""
                    }
                    onChange={(evt) =>
                      this.setState({
                        resourceTypeFilterInput: evt.target.value,
                      })
                    }
                  >
                    {this.resourcesList(t)}
                  </select>
                </div>
                <div className="col-1">
                  <label htmlFor="regionFilterInput">{t("Region")}</label>
                </div>
                <div className="col-xl-2">
                  <ClusterList
                    onError={(error) => this.setState({ error: error })}
                    value={this.state.regionFilterInput}
                    onChange={(value) =>
                      this.setState({
                        regionFilterInput: value,
                      })
                    }
                    filter={true}
                  />
                </div>
                <div className="col-xl-3 btn-group">
                  <button
                    className="btn btn-lg btn-primary"
                    onClick={() => this.updateTrades()}
                  >
                    {t("Filter trades")}
                  </button>
                  <button
                    className="btn btn-lg btn-secondary"
                    onClick={() => {
                      this.updateTrades();
                      this.setState({
                        resourceTypeFilterInput: null,
                        tradeTypeFilterInput: null,
                        regionFilterInput: null,
                      });
                    }}
                  >
                    {t("Clean filter")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="row">{this.tradeList()}</div>
          <Pagination
            currentPage={this.state.page}
            hasMore={this.state.hasMore}
            onPrev={() => this.updateTrades(this.state.page - 1)}
            onNext={() => this.updateTrades(this.state.page + 1)}
          ></Pagination>
        </div>
      </div>
    );
  }
}

export default withTranslation()(TradeSystem);
