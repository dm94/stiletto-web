import React, { useCallback } from "react";
import { SkillTreeGroup, SkillTree, SkillProvider } from "beautiful-skill-tree";
import { useTranslation } from "react-i18next";
import Ingredients from "../Ingredients";
import Ingredient from "../Ingredient";
import Icon from "../Icon";
import SkillNodeBtn from "./SkillNodeBtn";

const SkillTreeTab = ({ theme, treeId, title, items, clan }) => {
  const { t } = useTranslation();

  const getChildrens = useCallback(
    (parent) => {
      const childrens = [];
      const filteredItems = items.filter((it) => it.parent === parent);

      filteredItems.forEach((i) => {
        const item = {
          id: i.name,
          title: t(i.name),
          tooltip: { content: getContentItem(i) },
          children: getChildrens(i.name),
        };
        childrens.push(item);
      });

      return childrens;
    },
    [items, t],
  );

  const getContentItem = (item) => {
    return (
      <div className="mx-auto">
        <div className="text-center mb-1">
          <Icon key={item.name} name={item.name} width={35} />
        </div>
        <p className="text-center border-bottom border-warning">
          {t("crafting.whoHasLearnedIt")}
        </p>
        {clan ? (
          <SkillNodeBtn
            key={`btn-${item.name}`}
            item={item}
            clan={clan}
            tree={treeId}
          />
        ) : (
          t("techTree.needClanForFunction")
        )}
        <p className="text-center border-bottom border-warning mt-1">
          {t("crafting.costToLearn")}
        </p>
        {item.cost ? (
          <Ingredient
            key={`cost-${item.cost.name}`}
            ingredient={item.cost}
            value={1}
          />
        ) : (
          t("common.notDefined1")
        )}
        <p className="text-center border-bottom border-warning mt-2">
          {t("crafting.recipe")}
        </p>
        <div className="row">{showIngredient(item)}</div>
      </div>
    );
  };

  const handleSave = (storage, id, skills) => {
    return storage.setItem(`skills-${id}`, JSON.stringify(skills));
  };

  const showIngredient = (item) => {
    if (item?.crafting) {
      return item.crafting.map((ingredients) => (
        <div
          className={item.crafting.length > 1 ? "col-xl-6 border" : "col-xl-12"}
          key={`skill-ingredient-${item.name}`}
        >
          <Ingredients crafting={ingredients} value={1} />
        </div>
      ));
    }
  };

  return (
    <SkillProvider>
      <SkillTreeGroup theme={theme}>
        {() => (
          <SkillTree
            treeId={treeId}
            title={title}
            data={getChildrens(treeId)}
            handleSave={handleSave}
          />
        )}
      </SkillTreeGroup>
    </SkillProvider>
  );
};

export default SkillTreeTab;
