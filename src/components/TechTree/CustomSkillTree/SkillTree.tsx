import React, { useState, useEffect, useCallback } from "react";
import type { Item } from "../../../types/item";
import type { Tree } from "../../../types/dto/tech";
import SkillNode from "./SkillNode";

interface SkillTreeProps {
  treeId: Tree;
  title: string;
  data: Array<{
    id: string;
    title: string;
    children: any[];
  }>;
  handleSave?: (storage: Storage, treeId: string, skills: any) => void;
  clan?: number;
}

interface SkillState {
  [key: string]: {
    optional: boolean;
    nodeState: "selected" | "locked" | "unlocked";
  };
}

const SkillTree: React.FC<SkillTreeProps> = ({
  treeId,
  title,
  data,
  handleSave,
  clan,
}) => {
  const [skills, setSkills] = useState<SkillState>({});
  const [initialized, setInitialized] = useState(false);

  // Load saved skills from localStorage on component mount
  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem(`skills-${treeId}`);
      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      }
      setInitialized(true);
    } catch (error) {
      console.error("Error loading saved skills:", error);
      setInitialized(true);
    }
  }, [treeId]);

  // Save skills to localStorage when they change
  useEffect(() => {
    if (!initialized) return;

    try {
      if (handleSave && typeof localStorage !== "undefined") {
        handleSave(localStorage, treeId, skills);
      }
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  }, [skills, treeId, handleSave, initialized]);

  const toggleSkill = useCallback((skillId: string) => {
    setSkills((prevSkills) => {
      const newSkills = { ...prevSkills };

      // If skill doesn't exist in state, add it
      if (!newSkills[skillId]) {
        newSkills[skillId] = {
          optional: false,
          nodeState: "selected",
        };
      } else {
        // Toggle between selected and unlocked
        newSkills[skillId] = {
          ...newSkills[skillId],
          nodeState:
            newSkills[skillId].nodeState === "selected"
              ? "unlocked"
              : "selected",
        };
      }

      return newSkills;
    });
  }, []);

  const isSkillSelected = useCallback(
    (skillId: string) => {
      return skills[skillId]?.nodeState === "selected";
    },
    [skills],
  );

  // Check if a skill can be selected (parent is selected)
  const canSelectSkill = useCallback(
    (item: Item, allItems: Item[]) => {
      // If no parent, it's a root node and can always be selected
      if (!item.parent || item.parent === treeId) return true;

      // Find parent item
      const parentItem = allItems.find((i) => i.name === item.parent);
      if (!parentItem) return true; // If parent not found, allow selection

      // Check if parent is selected
      return isSkillSelected(parentItem.name);
    },
    [isSkillSelected, treeId],
  );

  // Recursive function to render tree nodes
  const renderTreeNodes = useCallback(
    (nodes: Item[], allItems: Item[], level = 0) => {
      return (
        <div
          className={`flex flex-wrap gap-4 justify-center mt-${level > 0 ? 8 : 0}`}
        >
          {nodes.map((item) => {
            // Find children of this node
            const children = allItems.filter((i) => i.parent === item.name);
            const isSelected = isSkillSelected(item.name);
            const isEnabled = canSelectSkill(item, allItems);

            return (
              <div key={item.name} className="flex flex-col items-center">
                <SkillNode
                  item={item}
                  isSelected={isSelected}
                  onSelect={toggleSkill}
                  clan={clan}
                  tree={treeId}
                  disabled={!isEnabled}
                />

                {children.length > 0 && (
                  <div className="mt-4 w-px h-8 bg-gray-600"></div>
                )}

                {children.length > 0 &&
                  renderTreeNodes(children, allItems, level + 1)}
              </div>
            );
          })}
        </div>
      );
    },
    [isSkillSelected, toggleSkill, canSelectSkill, clan, treeId],
  );

  // Find root level items (those with parent === treeId)
  const rootItems = data
    .filter((item) => item.id)
    .map((item) => ({
      name: item.id,
      parent: treeId,
      count: 1,
    }));

  // Convert data to Item[] format
  const allItems = data.reduce((acc: Item[], item) => {
    // Add current item
    acc.push({
      name: item.id,
      parent: treeId,
      count: 1,
    });

    // Add children recursively
    const addChildren = (children: any[], parent: string) => {
      children.forEach((child) => {
        acc.push({
          name: child.id,
          parent,
          count: 1,
        });

        if (child.children && child.children.length > 0) {
          addChildren(child.children, child.id);
        }
      });
    };

    if (item.children && item.children.length > 0) {
      addChildren(item.children, item.id);
    }

    return acc;
  }, []);

  return (
    <div className="p-6 bg-gray-900/80 rounded-lg border border-gray-700 overflow-x-auto min-w-full">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">
        {title}
      </h2>
      {renderTreeNodes(rootItems, allItems)}
    </div>
  );
};

export default SkillTree;
