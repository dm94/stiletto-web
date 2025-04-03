import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { Item } from "../../types/item";
import type { Tree } from "../../types/dto/tech";
import { getItemUrl } from "../../functions/utils";
import Icon from "../Icon";
import SkillNodeBtn from "./SkillNodeBtn";

interface NodeData {
  id: string;
  title: string;
  children: NodeData[];
  level: number;
  x: number;
  y: number;
  selected: boolean;
  item: Item;
}

interface EdgeData {
  from: string;
  to: string;
}

interface CustomSkillTreeProps {
  treeId: Tree;
  title: string;
  data: NodeData[];
  onSave?: (
    skills: Record<string, { optional: boolean; nodeState: string }>,
  ) => void;
}

interface SkillTreeProps {
  treeId: Tree;
  title: string;
  data: any[];
  handleSave: (storage: Storage, treeId: string, skills: any) => void;
}

interface SkillTreeGroupProps {
  theme: Record<string, unknown>;
  children: () => React.ReactNode;
}

interface SkillProviderProps {
  children: React.ReactNode;
}

// Custom implementation of SkillProvider
export const SkillProvider: React.FC<SkillProviderProps> = ({ children }) => {
  return <>{children}</>;
};

// Custom implementation of SkillTreeGroup
export const SkillTreeGroup: React.FC<SkillTreeGroupProps> = ({
  children,
  theme,
}) => {
  return (
    <div className="skill-tree-group" style={theme as React.CSSProperties}>
      {children()}
    </div>
  );
};

// Custom implementation of SkillTree
export const SkillTree: React.FC<SkillTreeProps> = ({
  treeId,
  title,
  data,
  handleSave,
}) => {
  const [skills, setSkills] = useState<
    Record<string, { optional: boolean; nodeState: string }>
  >({});
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);

  // Load saved skills from storage
  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem(`skills-${treeId}`);
      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      }
    } catch (error) {
      console.error("Error loading saved skills:", error);
    }
  }, [treeId]);

  // Process data to create nodes and edges
  useEffect(() => {
    const processedNodes: NodeData[] = [];
    const processedEdges: EdgeData[] = [];

    const processNode = (
      node: any,
      level = 0,
      parentId: string | null = null,
      index = 0,
      totalSiblings = 1,
    ) => {
      const nodeId = node.id;
      const x = index * (100 / (totalSiblings || 1)); // Horizontal position
      const y = level * 120; // Vertical position with spacing

      const isSelected = skills[nodeId]?.nodeState === "selected";

      const processedNode: NodeData = {
        ...node,
        level,
        x,
        y,
        selected: isSelected,
        item: node.item,
      };

      processedNodes.push(processedNode);

      if (parentId) {
        processedEdges.push({
          from: parentId,
          to: nodeId,
        });
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child: any, childIndex: number) => {
          processNode(
            child,
            level + 1,
            nodeId,
            childIndex,
            node.children.length,
          );
        });
      }
    };

    data.forEach((rootNode, index) => {
      processNode(rootNode, 0, null, index, data.length);
    });

    setNodes(processedNodes);
    setEdges(processedEdges);
  }, [data, skills]);

  // Toggle node selection
  const toggleNode = useCallback(
    (nodeId: string) => {
      setSkills((prevSkills) => {
        const newSkills = { ...prevSkills };

        // If node is already selected, deselect it
        if (newSkills[nodeId]?.nodeState === "selected") {
          newSkills[nodeId] = { optional: false, nodeState: "unlocked" };
        } else {
          // Otherwise select it
          newSkills[nodeId] = { optional: false, nodeState: "selected" };
        }

        // Save to storage
        if (handleSave && typeof window !== "undefined") {
          handleSave(localStorage, treeId, newSkills);
        }

        return newSkills;
      });
    },
    [handleSave, treeId],
  );

  return (
    <div className="custom-skill-tree p-4 bg-charcoal rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-sand">{title}</h2>

      <div
        className="skill-tree-container relative"
        style={{ minHeight: `${Math.max(...nodes.map((n) => n.y)) + 150}px` }}
      >
        {/* Render edges */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);

            if (!fromNode || !toNode) return null;

            // Calculate positions for the line
            const x1 = `${fromNode.x + 5}%`;
            const y1 = fromNode.y + 30; // Bottom of the node
            const x2 = `${toNode.x + 5}%`;
            const y2 = toNode.y; // Top of the node

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={toNode.selected ? "#834AC4" : "#4A3B31"}
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Render nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute skill-node p-2 rounded-lg cursor-pointer transition-all duration-300 border-2 ${node.selected ? "bg-tribal border-tribal" : "bg-sandDark border-sandDark hover:border-tribal"}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}px`,
              width: "10%",
              minWidth: "100px",
            }}
            onClick={() => toggleNode(node.id)}
            data-tooltip-id={`tooltip-${node.id}`}
          >
            <div className="text-center text-sm font-medium text-sandLight">
              {node.title}
            </div>
          </div>
        ))}

        {/* Tooltips */}
        {nodes.map((node) => (
          <div
            key={`tooltip-${node.id}`}
            id={`tooltip-${node.id}`}
            className="tooltip hidden absolute z-50 bg-charcoal border-2 border-tribal p-3 rounded-lg shadow-lg max-w-xs"
            style={{ width: "250px" }}
            data-node-id={node.id}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Main component that combines the custom implementations
const CustomSkillTree: React.FC<{
  theme: Record<string, unknown>;
  treeId: Tree;
  title: string;
  items: Item[];
  clan?: number;
}> = ({ theme, treeId, title, items, clan }) => {
  const { t } = useTranslation();

  // Function to build the tree structure
  const getChildrens = useCallback(
    (parent: string) => {
      const childrens: Array<{
        id: string;
        title: string;
        tooltip: { content: React.ReactNode };
        children: any[];
        item: Item;
      }> = [];
      const filteredItems = items.filter((it) => it.parent === parent);

      for (const i of filteredItems) {
        const item = {
          id: i.name,
          title: t(i.name),
          tooltip: { content: getContentItem(i) },
          children: getChildrens(i.name),
          item: i,
        };
        childrens.push(item);
      }

      return childrens;
    },
    [items, t, clan, treeId],
  );

  // Function to generate tooltip content
  const getContentItem = useCallback(
    (item: Item): React.ReactNode => {
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
          <p className="text-center border-b border-warning">
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
    },
    [clan, t, treeId],
  );

  // Function to save skills to storage
  const handleSave = useCallback(
    (storage: Storage, id: string, skills: any): void => {
      storage.setItem(`skills-${id}`, JSON.stringify(skills));
    },
    [],
  );

  // Initialize tooltips
  useEffect(() => {
    const showTooltip = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const node = target.closest("[data-tooltip-id]");

      if (node) {
        const tooltipId = node.getAttribute("data-tooltip-id");
        const tooltip = document.getElementById(tooltipId || "");

        if (tooltip) {
          // Position tooltip near the node
          const rect = node.getBoundingClientRect();
          tooltip.style.left = `${rect.right + 10}px`;
          tooltip.style.top = `${rect.top}px`;
          tooltip.classList.remove("hidden");
        }
      }
    };

    const hideTooltips = () => {
      document.querySelectorAll(".tooltip").forEach((tooltip) => {
        tooltip.classList.add("hidden");
      });
    };

    document.addEventListener("mouseover", showTooltip);
    document.addEventListener("mouseout", hideTooltips);

    return () => {
      document.removeEventListener("mouseover", showTooltip);
      document.removeEventListener("mouseout", hideTooltips);
    };
  }, []);

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

export default CustomSkillTree;
