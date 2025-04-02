import React, { ReactNode } from "react";
import SkillProvider from "./SkillProvider";

interface SkillTreeGroupProps {
  theme?: Record<string, unknown>;
  children: (props: any) => ReactNode;
}

const SkillTreeGroup: React.FC<SkillTreeGroupProps> = ({ children, theme }) => {
  // The theme prop is passed to maintain API compatibility with beautiful-skill-tree
  // but we handle styling with Tailwind CSS in our implementation
  return <SkillProvider>{children({ theme })}</SkillProvider>;
};

export default SkillTreeGroup;
