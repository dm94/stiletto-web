import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import Ingredients from "../components/Ingredients";
import Ingredient from "../components/Ingredient";
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
      usersSavedData: [],
      tabSelect: "Vitamins",
    };
  }

  async componentDidMount() {
    let items = await getItems();
    if (items != null) {
      items = items.filter((it) => it.parent != null);
      this.setState({ items: items });
      this.updateSaveData();
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
          <title>{t("Tech Tree")} - Stiletto</title>
          <meta
            name="description"
            content="View and control your clan's technology tree."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Tech Tree - Stiletto" />
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
        <h2>{t("Testing phase. May have performance problems")}</h2>
        <nav className="nav-fill">
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a
              className="nav-item nav-link active"
              id="nav-vitamins-tab"
              data-toggle="tab"
              href="#nav-vitamins"
              role="tab"
              onClick={() => this.setState({ tabSelect: "Vitamins" })}
            >
              {t("Vitamins")}
            </a>
            <a
              className="nav-item nav-link"
              id="nav-equipment-tab"
              data-toggle="tab"
              href="#nav-equipment"
              role="tab"
              onClick={() => this.setState({ tabSelect: "Equipment" })}
            >
              {t("Equipment")}
            </a>
            <a
              className="nav-item nav-link"
              id="nav-crafting-tab"
              data-toggle="tab"
              href="#nav-crafting"
              role="tab"
              onClick={() => this.setState({ tabSelect: "Crafting" })}
            >
              {t("Crafting")}
            </a>
            <a
              className="nav-item nav-link"
              id="nav-construction-tab"
              data-toggle="tab"
              href="#nav-construction"
              role="tab"
              onClick={() => this.setState({ tabSelect: "Construction" })}
            >
              {t("Construction")}
            </a>
            <a
              className="nav-item nav-link"
              id="nav-walkers-tab"
              data-toggle="tab"
              href="#nav-walkers"
              role="tab"
              onClick={() => this.setState({ tabSelect: "Walkers" })}
            >
              {t("Walkers")}
            </a>
          </div>
        </nav>
        <div className="overflow-auto">
          <div className="tab-content">
            <SkillTreeTab
              treeId={this.state.tabSelect}
              title={t(this.state.tabSelect)}
              data={this.getChildrens(this.state.tabSelect)}
              theme={theme}
            />
          </div>
        </div>
      </div>
    );
  }

  updateSaveData = () => {
    let learned = [];
    let saveData = {};

    this.state.usersSavedData.forEach((user) => {
      learned = learned.concat(user.learned);
    });

    this.state.items.forEach((i) => {
      if (learned.includes(i.name)) {
        saveData[i.name] = {
          optional: false,
          nodeState: "selected",
        };
      }
    });

    this.setState({ savedData: saveData, isLoaded: true });
  };

  getChildrens(parent) {
    const { t } = this.props;
    let childrens = [];

    let items = this.state.items.filter((it) => it.parent === parent);

    items.forEach((i) => {
      let item = {
        id: i.name,
        title: t(i.name),
        tooltip: { content: this.getContentItem(i) },
        children: this.getChildrens(i.name),
      };

      childrens.push(item);
    });

    return childrens;
  }

  getContentItem(item) {
    const { t } = this.props;
    return (
      <div className="mx-auto">
        <p className="text-center border-bottom border-warning">
          {t("Who have learned it?")}
        </p>
        <ul className="list-inline">{this.getWhoHasLearnedIt(item.name)}</ul>
        <p className="text-center border-bottom border-warning">
          {t("Cost to learn")}
        </p>
        {item.cost != null ? (
          <Ingredient
            key={"cost-" + item.cost.name}
            ingredient={item.cost}
            value={1}
          />
        ) : (
          t("Not defined")
        )}
        <p className="text-center border-bottom border-warning mt-2">
          {t("Recipe")}
        </p>
        <div className="row">{this.showIngredient(item)}</div>
      </div>
    );
  }

  getWhoHasLearnedIt(name) {
    return this.state.usersSavedData
      .filter((user) => user.learned.includes(name))
      .map((user) => (
        <li className="list-inline-item" key={name + "-" + user.discordtag}>
          {user.discordtag} -{" "}
        </li>
      ));
  }

  showIngredient(item) {
    if (item != null && item.crafting != null) {
      return item.crafting.map((ingredients, index) => (
        <div
          className={item.crafting.length > 1 ? "col-xl-6 border" : "col-xl-12"}
          key={"ingredients-" + index + "-" + item.name}
        >
          <Ingredients crafting={ingredients} value={1} />
        </div>
      ));
    }
  }
}

export default withTranslation()(TechTree);
