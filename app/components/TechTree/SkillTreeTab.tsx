import type React from "react";
import type { TechItem } from "@ctypes/item";
import type { Tree } from "@ctypes/dto/tech";
import ModernSkillTree from "./ModernSkillTree";

interface SkillTreeTabProps {
  treeId: Tree;
  title: string;
  items: TechItem[];
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
