import type React from "react";
import type { Item } from "../../types/item";
import type { Tree } from "../../types/dto/tech";
import ModernSkillTree from "./ModernSkillTree";

interface SkillTreeTabProps {
  treeId: Tree;
  title: string;
  items: Item[];
  clan?: number;
}

const SkillTreeTab: React.FC<SkillTreeTabProps> = ({
  treeId,
  title,
  items,
  clan,
}) => {
  return (
    <ModernSkillTree treeId={treeId} title={title} items={items} clan={clan} />
  );
};

export default SkillTreeTab;
