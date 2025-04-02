import React, { createContext, useState, useContext, ReactNode } from "react";

interface SkillContextType {
  skills: Record<string, { optional: boolean; nodeState: string }>;
  updateSkill: (
    skillId: string,
    state: { optional: boolean; nodeState: string },
  ) => void;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error("useSkillContext must be used within a SkillProvider");
  }
  return context;
};

interface SkillProviderProps {
  children: ReactNode;
}

const SkillProvider: React.FC<SkillProviderProps> = ({ children }) => {
  const [skills, setSkills] = useState<
    Record<string, { optional: boolean; nodeState: string }>
  >({});

  const updateSkill = (
    skillId: string,
    state: { optional: boolean; nodeState: string },
  ) => {
    setSkills((prevSkills) => ({
      ...prevSkills,
      [skillId]: state,
    }));
  };

  return (
    <SkillContext.Provider value={{ skills, updateSkill }}>
      {children}
    </SkillContext.Provider>
  );
};

export default SkillProvider;
