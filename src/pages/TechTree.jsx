import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { SkillTreeGroup, SkillTree, SkillProvider } from "beautiful-skill-tree";
import LoadingScreen from "../components/LoadingScreen";
import ModalMessage from "../components/ModalMessage";

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
        { discordid: "000000000", vitamins: ["Vision Powder", "Jojo Mojo"] },
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

    return (
      <div className="container">
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
        <div className="row">
          <div className="col-12">
            <nav>
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
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active mw-100 overflow-auto"
                id="nav-vitamins"
                role="tabpanel"
                aria-labelledby="nav-vitamins-tab"
              >
                <SkillProvider>
                  <SkillTreeGroup>
                    {({ skillCount }) => (
                      <SkillTree
                        treeId="Vitamins"
                        title={t("Vitamins")}
                        savedData={this.state.savedData}
                        data={this.getChildrens("Vitamins")}
                      />
                    )}
                  </SkillTreeGroup>
                </SkillProvider>
              </div>
              <div
                className="tab-pane fade mw-100 overflow-auto"
                id="nav-equipment"
                role="tabpanel"
                aria-labelledby="nav-equipment-tab"
              >
                <SkillProvider>
                  <SkillTreeGroup>
                    {({ skillCount }) => (
                      <SkillTree
                        treeId="Equipment"
                        title={t("Equipment")}
                        savedData={this.state.savedData}
                        data={this.getChildrens("Equipment")}
                      />
                    )}
                  </SkillTreeGroup>
                </SkillProvider>
              </div>
              <div
                className="tab-pane fade mw-100 overflow-auto"
                id="nav-crafting"
                role="tabpanel"
                aria-labelledby="nav-crafting-tab"
              >
                <SkillProvider>
                  <SkillTreeGroup>
                    {({ skillCount }) => (
                      <SkillTree
                        treeId="Crafting"
                        title={t("Crafting")}
                        savedData={this.state.savedData}
                        data={this.getChildrens("Crafting")}
                      />
                    )}
                  </SkillTreeGroup>
                </SkillProvider>
              </div>
              <div
                className="tab-pane fade mw-100 overflow-auto"
                id="nav-construction"
                role="tabpanel"
                aria-labelledby="nav-construction-tab"
              >
                <SkillProvider>
                  <SkillTreeGroup>
                    {({ skillCount }) => (
                      <SkillTree
                        treeId="Construction"
                        title={t("Construction")}
                        savedData={this.state.savedData}
                        data={this.getChildrens("Construction")}
                      />
                    )}
                  </SkillTreeGroup>
                </SkillProvider>
              </div>
              <div
                className="tab-pane fade mw-100 overflow-auto"
                id="nav-walkers"
                role="tabpanel"
                aria-labelledby="nav-walkers-tab"
              >
                <SkillProvider>
                  <SkillTreeGroup>
                    {({ skillCount }) => (
                      <SkillTree
                        treeId="Walkers"
                        title={t("Walkers")}
                        savedData={this.state.savedData}
                        data={this.getChildrens("Walkers")}
                      />
                    )}
                  </SkillTreeGroup>
                </SkillProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  updateSaveData() {
    let learned = [];
    let saveData = {};

    this.state.usersSavedData.forEach((user) => {
      learned = learned.concat(user.vitamins);
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
  }

  getChildrens(parent) {
    const { t } = this.props;
    let childrens = [];

    let items = this.state.items.filter((it) => it.parent === parent);

    items.forEach((i) => {
      let item = {
        id: i.name,
        title: t(i.name),
        tooltip: { content: i.category },
        children: this.getChildrens(i.name),
      };

      childrens.push(item);
    });

    return childrens;
  }
}

export default withTranslation()(TechTree);
