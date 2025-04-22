import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { Item } from "@ctypes/item";
import type { Tree } from "@ctypes/dto/tech";
import type { SkillStateMap } from "@ctypes/Skill";
import { getItemUrl } from "@functions/utils";
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
  parentX?: number;
  parentY?: number;
}

interface EdgeData {
  from: string;
  to: string;
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
  const [skills, setSkills] = useState<SkillStateMap>({});
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

  // Process data to create nodes and edges with horizontal layout
  useEffect(() => {
    const processedNodes: NodeData[] = [];
    const processedEdges: EdgeData[] = [];

    // Define interface for processNode parameters
    interface ProcessNodeParams {
      node: any;
      level?: number;
      parentId?: string | null;
      parentX?: number | null;
      parentY?: number | null;
      index?: number;
      totalSiblings?: number;
      direction?: number; // 1 for up, -1 for down
    }

    // Calculate positions for a horizontal tree layout (left to right)
    const processNode = ({
      node,
      level = 0,
      parentId = null,
      parentX = null,
      parentY = null,
      index = 0,
      totalSiblings = 1,
      direction = 1, // 1 for up, -1 for down
    }: ProcessNodeParams) => {
      const nodeId = node.id;

      // Base horizontal and vertical spacing between nodes
      const horizontalSpacing = 180; // Increased for better horizontal spacing
      const verticalSpacing = 100;

      // Calculate position based on level and index
      // For horizontal layout, x increases with level and y varies with index
      let x: number;
      let y: number;

      if (parentX !== null && parentY !== null) {
        // Position relative to parent for non-root nodes
        // Move right for each level
        x = parentX + horizontalSpacing;

        // Calculate vertical position relative to parent
        const offset = index - (totalSiblings - 1) / 2;
        y = parentY + offset * verticalSpacing * 0.8;
      } else {
        // Root nodes positioning - vertical stack on the left side
        x = 50; // Start from left side
        y = 100 + index * verticalSpacing * 1.2; // Stack vertically
      }

      const isSelected = skills[nodeId]?.nodeState === "selected";

      const processedNode: NodeData = {
        ...node,
        level,
        x,
        y,
        parentX: parentX,
        parentY: parentY,
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

      // Process children with consistent horizontal flow
      if (node.children && node.children.length > 0) {
        node.children.forEach((child: any, childIndex: number) => {
          processNode({
            node: child,
            level: level + 1,
            parentId: nodeId,
            parentX: x,
            parentY: y,
            index: childIndex,
            totalSiblings: node.children.length,
            direction,
          });
        });
      }
    };

    // Process each root node
    data.forEach((rootNode, index) => {
      processNode({
        node: rootNode,
        level: 0,
        parentId: null,
        parentX: null,
        parentY: null,
        index,
        totalSiblings: data.length,
      });
    });

    setNodes(processedNodes);
    setEdges(processedEdges);
  }, [data, skills]);

  // Toggle node selection
  const toggleNode = useCallback(
    (nodeId: string) => {
      setSkills((prevSkills) => {
        const newSkills = { ...prevSkills };

        if (newSkills[nodeId]?.nodeState === "selected") {
          newSkills[nodeId] = { nodeState: "unlocked" };
        } else {
          // Otherwise select it
          newSkills[nodeId] = { nodeState: "selected" };
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
    <div className="custom-skill-tree p-6 bg-charcoal rounded-lg border-2 border-tribal">
      <h2 className="text-2xl font-bold mb-6 text-sand font-['Okami'] border-b-2 border-tribal pb-2">
        {title}
      </h2>

      <div
        className="skill-tree-container relative overflow-x-auto"
        style={{
          minHeight: `${Math.max(...nodes.map((n) => n.y)) + 150}px`,
          minWidth: `${Math.max(...nodes.map((n) => n.x)) + 200}px`,
        }}
      >
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#834AC4" />
            </marker>
            <marker
              id="arrowhead-selected"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#9b6ad8" />
            </marker>
          </defs>
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);

            if (!fromNode || !toNode) {
              return null;
            }

            // Calculate positions for the path
            const x1 = fromNode.x + 60; // Right side of the node
            const y1 = fromNode.y + 30; // Middle of the node
            const x2 = toNode.x; // Left side of the node
            const y2 = toNode.y + 30; // Middle of the node

            // Calculate control points for the curve
            const midX = (x1 + x2) / 2;

            // Create a curved path
            const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

            const isSelected = toNode.selected;
            const strokeColor = isSelected ? "#9b6ad8" : "#834AC4";
            const strokeWidth = isSelected ? 3 : 2;
            const markerId = isSelected ? "arrowhead-selected" : "arrowhead";

            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={path}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray="none"
                className="transition-all duration-300"
                markerEnd={`url(#${markerId})`}
              />
            );
          })}
        </svg>

        {/* Render nodes with diamond shape styling */}
        {nodes.map((node) => (
          <button
            type="button"
            key={node.id}
            className={`absolute skill-node cursor-pointer transition-all duration-300 shadow-lg transform hover:scale-105 ${node.selected ? "selected" : ""}`}
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: "60px",
              height: "60px",
              zIndex: node.selected ? 10 : 5,
              clipPath:
                "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" /* Diamond shape */,
              backgroundColor: node.selected ? "#9b6ad8" : "#834AC4",
              border: node.selected ? "2px solid #d1b3ff" : "2px solid #6b3fa0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => toggleNode(node.id)}
            data-tooltip-id={`tooltip-${node.id}`}
          >
            <div className="flex flex-col items-center justify-center">
              <Icon name={node.id} width={24} /> {node.id}
              <div className="absolute top-full mt-2 text-center text-xs font-medium text-sandLight whitespace-nowrap">
                {node.title}
              </div>
              {node.selected && (
                <div className="absolute w-full h-full selected-node" />
              )}
            </div>
          </button>
        ))}

        {/* Tooltips */}
        {nodes.map((node) => (
          <div
            key={`tooltip-${node.id}`}
            id={`tooltip-${node.id}`}
            className="tooltip hidden absolute z-50 bg-charcoal border-2 border-purple-600 p-3 rounded-lg shadow-lg max-w-xs"
            style={{ width: "250px" }}
            data-node-id={node.id}
          />
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
        const tooltip = document.getElementById(tooltipId ?? "");

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
