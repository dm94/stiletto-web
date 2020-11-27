import React, { Component } from "react";
import ModalMessage from "../components/ModalMessage";
import LoadingScreen from "../components/LoadingScreen";
import TransactionListItem from "../components/TransactionListItem";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
const axios = require("axios");

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      isLoaded: false,
      transactions: null,
      redirect: false,
      error: null,
      inputDiscodId: "",
      showLinkDiscordButton: false,
      isFiltered: false,
      searchInput: "",
      transactionsFiltered: [],
    };
  }

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_API_URL + "/flots.php", {
        params: {
          discordid: this.state.user_discord_id,
          token: this.state.token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ transactions: response.data });
        } else if (response.status === 205) {
          localStorage.clear();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        }
        this.setState({ isLoaded: true });
      })
      .catch((error) => {
        this.setState({ error: "Error when connecting to the API" });
      });
  }

  transactionList() {
    if (this.state.isFiltered) {
      return this.state.transactionsFiltered.map((transaction) => (
        <TransactionListItem
          key={transaction.transactionID}
          transaction={transaction}
        />
      ));
    } else {
      if (
        this.state.transactions != null &&
        this.state.transactions[0] != null &&
        this.state.transactions[0].transactionID != null
      ) {
        return this.state.transactions.map((transaction) => (
          <TransactionListItem
            key={transaction.transactionID}
            transaction={transaction}
          />
        ));
      }
    }
  }

  searchTransactions = (event) => {
    event.preventDefault();
    let transactionsFiltered = this.state.transactions.filter((t) =>
      t.description.toLowerCase().match(this.state.searchInput.toLowerCase())
    );
    this.setState({
      transactionsFiltered: transactionsFiltered,
      isFiltered: true,
    });
  };

  clearSearch = (event) => {
    event.preventDefault();
    this.setState({
      transactionsFiltered: [],
      isFiltered: false,
      searchInput: "",
    });
  };

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
    if (
      localStorage.getItem("discordid") != null &&
      localStorage.getItem("token") != null
    ) {
      if (!this.state.isLoaded) {
        return <LoadingScreen />;
      }
      return (
        <div>
          <Helmet>
            <title>Transactions List - Stiletto</title>
            <meta
              name="description"
              content="This is the list of all the transactions"
            />
          </Helmet>
          <table className="table">
            <thead>
              <tr>
                <th className="text-center" scope="col">
                  {t("Balance")}
                </th>
                <th className="text-center" scope="col">
                  {t("Total")}
                </th>
                <th className="text-center" scope="col">
                  {t("Date")}
                </th>
                <th scope="col">
                  <div className="input-group input-group-sm w-50 mb-0 mx-auto">
                    <input
                      className="form-control"
                      id="search-name"
                      type="search"
                      placeholder="Description.."
                      aria-label="Search"
                      onChange={(evt) =>
                        this.setState({
                          searchInput: evt.target.value,
                        })
                      }
                      value={this.state.searchInput}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => this.searchTransactions(e)}
                      >
                        {t("Search")}
                      </button>
                      <button
                        type="button"
                        className={
                          this.state.isFiltered
                            ? "btn btn-success"
                            : "btn btn-success d-none"
                        }
                        onClick={(e) => this.clearSearch(e)}
                      >
                        {t("Clean")}
                      </button>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>{this.transactionList()}</tbody>
          </table>
        </div>
      );
    }
    return (
      <ModalMessage
        message={{
          isError: true,
          text: t("Login again"),
          redirectPage: "/profile",
        }}
      />
    );
  }
}

export default withTranslation()(Transactions);
