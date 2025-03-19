import type React from "react";
import { useCallback } from "react";
import { SkillTreeGroup, SkillTree, SkillProvider } from "beautiful-skill-tree";
import { useTranslation } from "react-i18next";
import Ingredients from "../Ingredients";
import Ingredient from "../Ingredient";
import Icon from "../Icon";
import SkillNodeBtn from "./SkillNodeBtn";

interface SkillItem {
  name: string;
  parent: string;
  cost?: {
    name: string;
    count: number;
    category?: string;
  };
  crafting?: Array<{
    ingredients: Array<{
      name: string;
      count: number;
      category?: string;
    }>;
    output?: number;
  }>;
}

interface SkillTreeTabProps {
  theme: Record<string, unknown>;
  treeId: string;
  title: string;
  items: SkillItem[];
  clan?: string;
}

const SkillTreeTab: React.FC<SkillTreeTabProps> = ({
  theme,
  treeId,
  title,
  items,
  clan,
}) => {
  const { t } = useTranslation();

  const getChildrens = useCallback(
    (parent: string) => {
      const childrens: Array<{
        id: string;
        title: string;
        tooltip: { content: React.ReactNode };
        children: any[];
      }> = [];
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

  const getContentItem = (item: SkillItem): React.ReactNode => {
    return (
      <div className="mx-auto">
        <div className="text-center mb-1">
          <Icon key={item.name} name={item.name} width="35" />
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

  const handleSave = (
    storage: Storage,
    id: string,
    skills: any,
  ): Promise<void> => {
    return storage.setItem(`skills-${id}`, JSON.stringify(skills));
  };

  const showIngredient = (item: SkillItem): React.ReactNode => {
    if (item?.crafting) {
      return item.crafting.map((ingredients) => (
        <div
          className={
            item.crafting?.length > 1 ? "col-xl-6 border" : "col-xl-12"
          }
          key={`skill-ingredient-${item.name}`}
        >
          <Ingredients crafting={ingredients} value={1} />
        </div>
      ));
    }
    return null;
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
