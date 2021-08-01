import React, { Component } from "react";
import { SkillTreeGroup, SkillTree, SkillProvider } from "beautiful-skill-tree";
import { withTranslation } from "react-i18next";
import SkillNodeBtn from "./SkillNodeBtn";
import Ingredients from "./Ingredients";
import Ingredient from "./Ingredient";

class SkillTreeTab extends Component {
  state = {};
  render() {
    return (
      <div>
        <SkillProvider>
          <SkillTreeGroup theme={this.props.theme}>
            {() => (
              <SkillTree
                treeId={this.props.treeId}
                title={this.props.title}
                data={this.getChildrens(this.props.title)}
                handleSave={this.handleSave}
              />
            )}
          </SkillTreeGroup>
        </SkillProvider>
      </div>
    );
  }

  getChildrens(parent) {
    const { t } = this.props;
    let childrens = [];

    let items = this.props.items.filter((it) => it.parent === parent);

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
        <SkillNodeBtn key={"btn-" + item.name} item={item}></SkillNodeBtn>
        <p className="text-center border-bottom border-warning mt-1">
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

  handleSave = (storage, treeId, skills) => {
    return storage.setItem(`skills-${treeId}`, JSON.stringify(skills));
  };

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

export default withTranslation()(SkillTreeTab);
