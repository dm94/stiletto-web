import type React from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import SkillNodeBtn from "./SkillNodeBtn";
import type { Item } from "../../types/item";
import type { Tree } from "../../types/dto/tech";
import { getItemUrl } from "../../functions/utils";
import { SkillTreeGroup, SkillTree, SkillProvider } from "./CustomSkillTree";

interface SkillTreeTabProps {
  theme: Record<string, unknown>;
  treeId: Tree;
  title: string;
  items: Item[];
  clan?: number;
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

      for (const i of filteredItems) {
        const item = {
          id: i.name,
          title: t(i.name),
          tooltip: { content: getContentItem(i) },
          children: getChildrens(i.name),
        };
        childrens.push(item);
      }

      return childrens;
    },
    [items, t],
  );

  const getContentItem = (item: Item): React.ReactNode => {
    return (
      <div className="mx-auto">
        <div className="text-center mb-1">
          <a
            href={getItemUrl(item.name)}
            target="_blank"
            rel="noopener noreferrer"
            title={t("menu.wiki")}
          >
            <Icon key={item.name} name={item.name} width={35} />
            {t("menu.wiki")}
          </a>
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
      </div>
    );
  };

  const handleSave = (storage: Storage, id: string, skills: any): void => {
    storage.setItem(`skills-${id}`, JSON.stringify(skills));
  };

  return (
    <SkillProvider>
      <SkillTreeGroup theme={theme}>
        {() => (
          <SkillTree
            treeId={treeId}
            title={title}
            data={getChildrens(treeId)}
            handleSave={(storage: any, treeId: string, skills: any) => {
              if ("setItem" in storage) {
                handleSave(storage as Storage, treeId, skills);
              }
            }}
            clan={clan}
          />
        )}
      </SkillTreeGroup>
    </SkillProvider>
  );
};

export default SkillTreeTab;
