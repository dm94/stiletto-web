import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { SkillTreeGroup, SkillTree, SkillProvider } from "beautiful-skill-tree";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";
import Ingredients from "../components/Ingredients";
import Ingredient from "../components/Ingredient";

class TechTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_discord_id: localStorage.getItem("discordid"),
      token: localStorage.getItem("token"),
      items: [],
      savedData: {},
      isLoaded: false,
      error: null,
      usersSavedData: [
        { discordtag: "Test#0000", learned: ["Vision Powder", "Jojo Mojo"] },
      ],
    };
  }

  componentDidMount() {
    Axios.get(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json"
    )
      .then((response) => {
        const items = response.data.filter((it) => it.parent != null);
        this.setState({ items: items });
      })
      .then(() => this.updateSaveData());
  }

  handleSave(storage, treeId, skills) {
    return storage.setItem(`skills-${treeId}`, JSON.stringify(skills));
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
    } else if (this.state.user_discord_id == null || this.state.token == null) {
      return (
        <ModalMessage
          message={{
            isError: true,
            text: t("You need to be logged in to enter this part"),
            redirectPage: "/profile",
          }}
        />
      );
    }

    if (!this.state.isLoaded) {
      return <LoadingScreen></LoadingScreen>;
    }

    const theme = {
      border: "1px solid rgb(127,127,127)",
      treeBackgroundColor: "rgba(60, 60, 60, 0.8)",
      nodeBackgroundColor: "rgba(10, 10, 10, 0.3)",
      nodeActiveBackgroundColor: "rgb(84, 170, 79)",
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
        <nav className="nav-fill">
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a
              className="nav-item nav-link active"
              id="nav-vitamins-tab"
              data-toggle="tab"
              href="#nav-vitamins"
              role="tab"
              aria-controls="nav-vitamins"
              aria-selected="true"
            >
              {t("Vitamins")}
            </a>
            <a
              className="nav-item nav-link"
              id="nav-equipment-tab"
              data-toggle="tab"
              href="#nav-equipment"
              role="tab"
              aria-controls="nav-equipment"
              aria-selected="false"
            >
              {t("Equipment")}
            </a>
            <a
              className="nav-item nav-link"
              id="nav-crafting-tab"
              data-toggle="tab"
              href="#nav-crafting"
              role="tab"
              aria-controls="nav-crafting"
              aria-selected="false"
            >
              {t("Crafting")}
            </a>
            <a
              className="nav-item nav-link"
              id="nav-construction-tab"
              data-toggle="tab"
              href="#nav-construction"
              role="tab"
              aria-controls="nav-construction"
              aria-selected="false"
            >
              {t("Construction")}
            </a>
            <a
              className="nav-item nav-link"
              id="nav-walkers-tab"
              data-toggle="tab"
              href="#nav-walkers"
              role="tab"
              aria-controls="nav-walkers"
              aria-selected="false"
            >
              {t("Walkers")}
            </a>
          </div>
        </nav>
        <div className="overflow-auto">
          <SkillProvider>
            <SkillTreeGroup theme={theme}>
              {() => (
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="nav-vitamins"
                    role="tabpanel"
                    aria-labelledby="nav-vitamins-tab"
                  >
                    <SkillTree
                      treeId="Vitamins"
                      title={t("Vitamins")}
                      savedData={this.state.savedData}
                      data={this.getChildrens("Vitamins")}
                    />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-equipment"
                    role="tabpanel"
                    aria-labelledby="nav-equipment-tab"
                  >
                    <SkillTree
                      treeId="Equipment"
                      title={t("Equipment")}
                      savedData={this.state.savedData}
                      data={this.getChildrens("Equipment")}
                    />
                  </div>
                  <div
                    className="tab-pane fade "
                    id="nav-crafting"
                    role="tabpanel"
                    aria-labelledby="nav-crafting-tab"
                  >
                    <SkillTree
                      treeId="Crafting"
                      title={t("Crafting")}
                      savedData={this.state.savedData}
                      data={this.getChildrens("Crafting")}
                    />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-construction"
                    role="tabpanel"
                    aria-labelledby="nav-construction-tab"
                  >
                    <SkillTree
                      treeId="Construction"
                      title={t("Construction")}
                      savedData={this.state.savedData}
                      data={this.getChildrens("Construction")}
                    />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-walkers"
                    role="tabpanel"
                    aria-labelledby="nav-walkers-tab"
                  >
                    <SkillTree
                      treeId="Walkers"
                      title={t("Walkers")}
                      savedData={this.state.savedData}
                      data={this.getChildrens("Walkers")}
                    />
                  </div>
                </div>
              )}
            </SkillTreeGroup>
          </SkillProvider>
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
