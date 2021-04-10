import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { SkillTreeGroup, SkillTree, SkillProvider } from "beautiful-skill-tree";
import LoadingScreen from "../components/LoadingScreen";

class TechTree extends Component {
  state = {
    items: [],
    savedData: {},
    isLoaded: false,
    usersSavedData: [
      { discordid: "000000000", vitamins: ["Vision Powder", "Jojo Mojo"] },
    ],
  };

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

    console.log(learned);

    this.state.items.forEach((i) => {
      if (learned.includes(i.name)) {
        saveData[i.name] = {
          optional: false,
          nodeState: "selected",
          learnedBy: ["0000000000", "fdsffffff"],
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
