import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Axios from "axios";
import { SkillTreeGroup, SkillTree, SkillProvider } from "beautiful-skill-tree";

class TechTree extends Component {
  state = {
    items: [],
  };

  componentDidMount() {
    Axios.get(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json"
    ).then((response) => {
      const items = response.data.filter((it) => it.parent != null);
      this.setState({ items });
    });
  }

  handleSave(storage, treeId, skills) {
    return storage.setItem(`skills-${treeId}`, JSON.stringify(skills));
  }

  render() {
    const { t } = this.props;
    const data = this.getChildrens("Vitamins");
    const savedData = {
      "Vision Powder": {
        optional: false,
        nodeState: "unlocked",
      },
      "Sinus Destroyer": {
        optional: false,
        nodeState: "locked",
      },
      "Jojo Mojo": {
        optional: false,
        nodeState: "unlocked",
      },
    };
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
                    treeId="vitamins"
                    title="Vitamins"
                    data={data}
                    savedData={savedData}
                  />
                )}
              </SkillTreeGroup>
            </SkillProvider>
          </div>
        </div>
      </div>
    );
  }

  getChildrens(parent) {
    let childrens = [];

    let items = this.state.items.filter((it) => it.parent === parent);

    items.forEach((i) => {
      let item = {
        id: i.name,
        title: i.name,
        tooltip: { content: i.category },
        children: this.getChildrens(i.name),
      };

      childrens.push(item);
    });

    return childrens;
  }
}

export default withTranslation()(TechTree);
