import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import Trade from "../components/Trade";
import { getItems } from "../services";

class TradeSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      isLoaded: false,
      clusters: null,
      trades: null,
      error: null,
      items: null,
      resourceTypeInput: "Aloe",
      tradeTypeInput: "Supply",
      amountInput: 0,
      regionInput: "EU",
      qualityInput: 0,
      priceInput: 0,
      filteredTrades: [],
      resourceTypeFilterInput: "Aloe",
      tradeTypeFilterInput: "Supply",
      regionFilterInput: "EU",
      isFiltered: false,
    };
  }

  componentDidMount() {
    this.updateRecipes();
    Axios.get(process.env.REACT_APP_API_URL + "/trades")
      .then((response) => {
        if (response.status === 200) {
          this.setState({ trades: response.data, isLoaded: true });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error connecting to the API" });
      });
    Axios.get(process.env.REACT_APP_API_URL + "/clusters")
      .then((response) => {
        if (response.status === 200) {
          this.setState({ clusters: response.data, isLoaded: true });
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
          it.category === "materials" ||
          it.category === "crafting/station" ||
          it.category === "modules"
      );
      this.setState({ items: items });
    }
  }

  deleteTrade = (idTrade) => {
    const options = {
      method: "delete",
      url: process.env.REACT_APP_API_URL + "/trades/" + idTrade,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  onClickCleanTrades = (event) => {
    event.preventDefault();
    this.setState({ filteredTrades: [], isFiltered: false });
  };

  onClickFilterTrades = (event) => {
    event.preventDefault();
    let filteredTrades = this.state.trades.filter(
      (it) =>
        it.region === this.state.regionFilterInput &&
        it.resource === this.state.resourceTypeFilterInput &&
        it.type === this.state.tradeTypeFilterInput
    );
    this.setState({ filteredTrades: filteredTrades, isFiltered: true });
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    Axios.request(options)
      .then((response) => {
        this.setState({
          resourceTypeInput: "Aloe",
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
              <div className="card-header">{t("Publish an trade")}</div>
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
                    <select
                      id="regionInput"
                      className="custom-select"
                      value={this.state.regionInput}
                      onChange={(evt) =>
                        this.setState({
                          regionInput: evt.target.value,
                        })
                      }
                    >
                      {this.clusterList()}
                    </select>
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
                    <label htmlFor="qualityInput">
                      {t("Quality")}: {this.state.qualityInput}
                    </label>
                    <input
                      id="qualityInput"
                      type="range"
                      className="form-control-range"
                      value={this.state.qualityInput}
                      max="100"
                      onChange={(evt) =>
                        this.setState({
                          qualityInput: evt.target.value,
                        })
                      }
                    />
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
          {t(item.name)}
        </option>
      ));
    }
  }

  clusterList() {
    if (this.state.clusters != null) {
      return this.state.clusters.map((cl) => (
        <option
          key={cl.region + "-" + cl.name}
          value={cl.region + "-" + cl.name}
        >
          {[cl.region] + " " + cl.name + " (" + cl.clan_limit + ")"}
        </option>
      ));
    }
  }

  tradeList(t) {
    if (this.state.trades != null) {
      if (this.state.isFiltered) {
        if (this.state.filteredTrades.length > 0) {
          return this.state.filteredTrades.map((trade) => (
            <Trade key={"trade" + trade.idtrade} trade={trade} />
          ));
        } else {
          return <div>{t("No trade offers were found with this filter")}</div>;
        }
      } else {
        return this.state.trades.map((trade) => (
          <Trade
            key={"trade" + trade.idtrade}
            trade={trade}
            onDelete={this.deleteTrade}
          />
        ));
      }
    }
  }

  render() {
    const { t } = this.props;
    if (this.state.error) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: t(this.state.error),
            redirectPage: "/profile",
          }}
        />
      );
    }
    if (!this.state.isLoaded) {
      return <LoadingScreen />;
    }
    return (
      <div className="row">
        <Helmet>
          <title>{t("Trades")} - Stiletto</title>
          <meta
            name="description"
            content="Publish your trade offers or what you need to make it easy for others to trade with you"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Trades - Stiletto" />
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
              window.location.protocol
                .concat("//")
                .concat(window.location.hostname) +
              (window.location.port ? ":" + window.location.port : "") +
              "/trades"
            }
          />
        </Helmet>
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
                    value={this.state.tradeTypeFilterInput}
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
                    value={this.state.resourceTypeFilterInput}
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
                  <select
                    id="regionFilterInput"
                    className="custom-select"
                    value={this.state.regionFilterInput}
                    onChange={(evt) =>
                      this.setState({
                        regionFilterInput: evt.target.value,
                      })
                    }
                  >
                    {this.clusterList()}
                  </select>
                </div>
                <div className="col-xl-3 btn-group">
                  <button
                    className="btn btn-lg btn-primary"
                    onClick={(e) => this.onClickFilterTrades(e)}
                  >
                    {t("Filter trades")}
                  </button>
                  <button
                    className="btn btn-lg btn-secondary"
                    onClick={(e) => this.onClickCleanTrades(e)}
                  >
                    {t("Clean filter")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="row">{this.tradeList(t)}</div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(TradeSystem);
