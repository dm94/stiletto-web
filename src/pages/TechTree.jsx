import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import SkillTreeTab from "../components/SkillTreeTab";
import { getItems } from "../services";
import "../css/tech-tree.css";

class TechTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      savedData: {},
      isLoaded: false,
      error: null,
      tabSelect:
        this.props.match.params.tree != null
          ? this.props.match.params.tree
          : "Vitamins",
    };
  }

  async componentDidMount() {
    if (this.props.match.params.tree != null) {
      this.setState({ tabSelect: this.props.match.params.tree });
    }
    console.log(this.props.match);
    let items = await getItems();
    if (items != null) {
      items = items.filter((it) => it.parent != null);
      this.setState({ items: items, isLoaded: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.tree !== this.state.tabSelect) {
      window.location.reload();
    }
  }

  deleteTree() {
    localStorage.removeItem(`skills-${this.state.tabSelect}`);
    window.location.reload();
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
      return <LoadingScreen></LoadingScreen>;
    }

    const theme = {
      h1FontSize: "50",
      border: "1px solid rgb(127,127,127)",
      treeBackgroundColor: "rgba(60, 60, 60, 0.8)",
      nodeBackgroundColor: "rgba(10, 10, 10, 0.3)",
      nodeAlternativeActiveBackgroundColor: "#834AC4",
      nodeActiveBackgroundColor: "#834AC4",
      nodeBorderColor: "#834AC4",
      nodeHoverBorderColor: "#834AC4",
    };

    return (
      <div className="container-fluid">
        <Helmet>
          <title>{t("Tech Tree")} - Stiletto for Last Oasis</title>
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
        <h2>{t("For now, the data is only saved on your computer")}</h2>
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
                {t("Walkers")}
              </NavLink>
            </div>
          </div>
        </nav>
        <div className="overflow-auto">
          <div className="tab-content">
            <SkillTreeTab
              treeId={this.state.tabSelect}
              title={t(this.state.tabSelect)}
              theme={theme}
              items={this.state.items}
            />
          </div>
        </div>
        <div className="w-100">
          <button
            className="btn btn-danger float-right my-2"
            onClick={() => this.deleteTree()}
          >
            {t("Delete Tree Data")}
          </button>
        </div>
      </div>
    );
  }
}

export default withTranslation()(TechTree);
