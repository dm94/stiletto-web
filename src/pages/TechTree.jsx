import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import {
  getItems,
  getUserProfile,
  closeSession,
  getStoredItem,
  storeItem,
} from "../services";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import Icon from "../components/Icon";
import SkillTreeTab from "../components/TechTree/SkillTreeTab";
import DoubleScrollbar from "../components/TechTree/DoubleScrollbar";

class TechTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      error: null,
      tabSelect:
        this.props.match.params.tree != null
          ? this.props.match.params.tree
          : "Vitamins",
      clan: null,
    };
  }

  async componentDidMount() {
    if (getStoredItem("token") != null) {
      let data = await getUserProfile();
      let clanid = data.message.clanid;

      this.setState({ clan: clanid });

      Axios.get(
        process.env.REACT_APP_API_URL +
          "/users/" +
          getStoredItem("discordid") +
          "/tech",
        {
          headers: {
            Authorization: `Bearer ${getStoredItem("token")}`,
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            if (response.data != null) {
              this.updateLearnedTree("Vitamins", response.data.Vitamins);
              this.updateLearnedTree("Equipment", response.data.Equipment);
              this.updateLearnedTree("Crafting", response.data.Crafting);
              this.updateLearnedTree(
                "Construction",
                response.data.Construction
              );
              this.updateLearnedTree("Walkers", response.data.Walkers);
            }
          } else if (response.status === 401) {
            closeSession();
            this.setState({
              error: "You don't have access here, try to log in again",
            });
          } else if (response.status === 503) {
            this.setState({ error: "Error connecting to database" });
          }
        })
        .catch(() => {
          this.setState({ error: "Error when connecting to the API" });
        });
    }
    if (this.props.match.params.tree != null) {
      this.setState({ tabSelect: this.props.match.params.tree });
    }
    let items = await getItems();
    if (items != null) {
      items = items.filter((it) => it.parent != null);
      this.setState({ items: items, isLoaded: true });
    }
  }

  updateLearnedTree(tree, data) {
    let all = {};

    if (data != null) {
      data.forEach((tech) => {
        all[tech] = { optional: false, nodeState: "selected" };
      });

      storeItem(`skills-${tree}`, JSON.stringify(all));
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.tree !== this.props.match.params.tree) {
      window.location.reload();
    }
  }

  deleteTree() {
    const options = {
      method: "put",
      url:
        process.env.REACT_APP_API_URL +
        "/users/" +
        getStoredItem("discordid") +
        "/tech",
      params: {
        tree: this.state.tabSelect,
      },
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
      data: [],
    };

    Axios.request(options)
      .then(() => {
        localStorage.removeItem(`skills-${this.state.tabSelect}`);
        sessionStorage.removeItem(`skills-${this.state.tabSelect}`);
        window.location.reload();
      })
      .catch(() => {
        localStorage.removeItem(`skills-${this.state.tabSelect}`);
        sessionStorage.removeItem(`skills-${this.state.tabSelect}`);
        window.location.reload();
      });
  }

  saveTree() {
    let data = JSON.parse(getStoredItem(`skills-${this.state.tabSelect}`));
    let learned = [];

    for (let item in data) {
      if (data[item].nodeState === "selected") {
        learned.push(item);
      }
    }
    const options = {
      method: "put",
      url:
        process.env.REACT_APP_API_URL +
        "/users/" +
        getStoredItem("discordid") +
        "/tech",
      params: {
        tree: this.state.tabSelect,
      },
      headers: {
        Authorization: `Bearer ${getStoredItem("token")}`,
      },
      data: learned,
    };

    Axios.request(options)
      .then((response) => {
        if (response.status === 200) {
          window.location.reload();
        } else if (response.status === 401) {
          closeSession();
          this.setState({
            error: "You don't have access here, try to log in again",
          });
        } else if (response.status === 503) {
          this.setState({ error: "Error connecting to database" });
        }
      })
      .catch(() => {
        this.setState({ error: "Error when connecting to the API" });
      });
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

    if (!this.state.isLoaded) {
      return (
        <Fragment>
          {this.helmetInfo()}
          <LoadingScreen></LoadingScreen>
        </Fragment>
      );
    }

    const theme = {
      h1FontSize: "50",
      border: "1px solid rgb(127,127,127)",
      treeBackgroundColor: "rgba(60, 60, 60, 0.9)",
      nodeBackgroundColor: "rgba(10, 10, 10, 0.3)",
      nodeAlternativeActiveBackgroundColor: "#834AC4",
      nodeActiveBackgroundColor: "#834AC4",
      nodeBorderColor: "#834AC4",
      nodeHoverBorderColor: "#834AC4",
    };

    return (
      <div className="container-fluid">
        {this.helmetInfo()}
        <nav className="nav-fill">
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <div className="nav-item">
              <NavLink
                className="nav-link"
                role="button"
                to={{
                  pathname: "/tech/Vitamins",
                }}
                activeClassName="active"
              >
                <Icon key="Vitamins" name="Vitamins" width={30} />{" "}
                {t("Vitamins")}
              </NavLink>
            </div>
            <div className="nav-item">
              <NavLink
                className="nav-link"
                role="button"
                to={{
                  pathname: "/tech/Equipment",
                }}
                activeClassName="active"
              >
                <Icon key="Equipment" name="Equipment" width={30} />
                {t("Equipment")}
              </NavLink>
            </div>
            <div className="nav-item">
              <NavLink
                className="nav-link"
                role="button"
                to={{
                  pathname: "/tech/Crafting",
                }}
                activeClassName="active"
              >
                <Icon key="Crafting" name="Crafting" width={30} />
                {t("Crafting")}
              </NavLink>
            </div>
            <div className="nav-item">
              <NavLink
                className="nav-link"
                role="button"
                to={{
                  pathname: "/tech/Construction",
                }}
                activeClassName="active"
              >
                <Icon key="Construction" name="Construction" width={30} />
                {t("Construction")}
              </NavLink>
            </div>
            <div className="nav-item">
              <NavLink
                className="nav-link"
                role="button"
                to={{ pathname: "/tech/Walkers" }}
                activeClassName="active"
              >
                <Icon key="Walkers" name="Walkers" width={30} />
                {t("Walkers")}
              </NavLink>
            </div>
          </div>
        </nav>
        {this.saveDeleteButtons(t)}
        <DoubleScrollbar className="w-100">
          <div className="tab-content-tree">
            <SkillTreeTab
              treeId={this.state.tabSelect}
              title={t(this.state.tabSelect)}
              theme={theme}
              items={this.state.items}
              clan={this.state.clan}
            />
          </div>
        </DoubleScrollbar>
      </div>
    );
  }

  helmetInfo() {
    return (
      <Helmet>
        <title>Tech Tree - Stiletto for Last Oasis</title>
        <meta
          name="description"
          content="View and control your clan's technology tree."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Tech Tree - Stiletto for Last Oasis"
        />
        <meta
          name="twitter:description"
          content="View and control your clan's technology tree."
        />
        <link
          rel="canonical"
          href={
            window.location.protocol
              .concat("//")
              .concat(window.location.hostname) +
            (window.location.port ? ":" + window.location.port : "") +
            "/tech"
          }
        />
      </Helmet>
    );
  }

  saveDeleteButtons(t) {
    if (getStoredItem("token") != null) {
      return (
        <div className="row">
          <div className="btn-group mx-auto" role="group">
            <button
              className="btn btn-success mr-auto m-2"
              onClick={() => this.saveTree()}
            >
              {t("Save Tree Data")}
            </button>
            <button
              className="btn btn-danger ml-auto m-2"
              onClick={() => this.deleteTree()}
            >
              {t("Delete Tree Data")}
            </button>
          </div>
        </div>
      );
    }

    return "";
  }
}

export default withTranslation()(TechTree);
