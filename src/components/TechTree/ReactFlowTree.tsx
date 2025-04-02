import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import { useTranslation } from "react-i18next";
import type { Item } from "../../types/item";
import type { Tree } from "../../types/dto/tech";
import { getItemUrl } from "../../functions/utils";
import Icon from "../Icon";
import SkillNodeBtn from "./SkillNodeBtn";

interface ReactFlowTreeProps {
  theme: Record<string, unknown>;
  treeId: Tree;
  title: string;
  items: Item[];
  clan?: number;
}

// Custom node component for tech tree items
const TechNode = ({ data }: { data: any }) => {
  return (
    <div className="p-2 rounded-lg border-2 border-purple-500 bg-gray-800 text-white">
      <div className="text-center font-bold">{data.label}</div>
      {data.icon && (
        <div className="flex justify-center mt-1">
          <Icon name={data.id} width={30} />
        </div>
      )}
    </div>
  );
};

// Custom tooltip component
const NodeTooltip = ({
  item,
  treeId,
  clan,
  t,
}: { item: Item; treeId: Tree; clan?: number; t: any }) => {
  return (
    <div className="mx-auto bg-gray-900 p-3 rounded-lg border border-purple-500 shadow-lg max-w-xs">
      <div className="text-center mb-1">
        <a
          href={getItemUrl(item.name)}
          target="_blank"
          rel="noopener noreferrer"
          title={t("menu.wiki")}
          className="flex items-center justify-center text-blue-400 hover:text-blue-300"
        >
          <Icon key={item.name} name={item.name} width={35} />
          <span className="ml-2">{t("menu.wiki")}</span>
        </a>
      </div>
      <p className="text-center border-bottom border-warning text-yellow-400 pb-1 mb-2">
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
        <p className="text-center text-gray-400">
          {t("techTree.needClanForFunction")}
        </p>
      )}
    </div>
  );
};

const nodeTypes = {
  techNode: TechNode,
};

const ReactFlowTree = ({
  theme,
  treeId,
  title,
  items,
  clan,
}: ReactFlowTreeProps) => {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Item | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Load skills from localStorage if available
  const loadSavedSkills = useCallback(() => {
    try {
      const savedSkills = localStorage.getItem(`skills-${treeId}`);
      if (savedSkills) {
        return JSON.parse(savedSkills);
      }
    } catch (error) {
      console.error("Error loading saved skills:", error);
    }
    return {};
  }, [treeId]);

  // Save skills to localStorage
  const saveSkills = useCallback(
    (skills: Record<string, { optional: boolean; nodeState: string }>) => {
      try {
        localStorage.setItem(`skills-${treeId}`, JSON.stringify(skills));
      } catch (error) {
        console.error("Error saving skills:", error);
      }
    },
    [treeId],
  );

  // Build the tree structure
  const buildTree = useCallback(() => {
    const savedSkills = loadSavedSkills();
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const processedItems = new Set<string>();
    const levelMap = new Map<string, number>();

    // First pass: determine levels for each node
    const determineLevel = (itemName: string, level = 0): number => {
      if (levelMap.has(itemName)) {
        return levelMap.get(itemName)!;
      }

      levelMap.set(itemName, level);

      const children = items.filter((item) => item.parent === itemName);
      for (const child of children) {
        const childLevel = determineLevel(child.name, level + 1);
        if (childLevel > levelMap.get(itemName)!) {
          levelMap.set(itemName, childLevel);
        }
      }

      return levelMap.get(itemName)!;
    };

    // Determine levels for all items
    items.forEach((item) => {
      if (item.parent === treeId) {
        determineLevel(item.name, 0);
      }
    });

    // Second pass: create nodes and edges
    const createNodesAndEdges = (
      parentName: string,
      xOffset = 0,
      level = 0,
    ) => {
      const children = items.filter((item) => item.parent === parentName);
      const spacing = 200; // Horizontal spacing between nodes
      const verticalSpacing = 150; // Vertical spacing between levels

      // Sort children by name for consistent layout
      children.sort((a, b) => a.name.localeCompare(b.name));

      // Calculate total width needed for this level
      const totalWidth = (children.length - 1) * spacing;
      const startX = xOffset - totalWidth / 2;

      children.forEach((item, index) => {
        if (processedItems.has(item.name)) return;
        processedItems.add(item.name);

        const x = startX + index * spacing;
        const y = level * verticalSpacing;

        // Create node
        const isSelected = savedSkills[item.name]?.nodeState === "selected";
        newNodes.push({
          id: item.name,
          type: "techNode",
          position: { x, y },
          data: {
            label: t(item.name),
            id: item.name,
            icon: true,
            selected: isSelected,
          },
          style: {
            background: isSelected
              ? (theme.nodeActiveBackgroundColor as string) || "#834AC4"
              : "transparent",
            borderColor: isSelected
              ? (theme.nodeHoverBorderColor as string) || "#834AC4"
              : "#666",
            borderWidth: isSelected ? 2 : 1,
          },
        });

        // Create edge from parent to this node
        if (parentName !== treeId) {
          newEdges.push({
            id: `${parentName}-${item.name}`,
            source: parentName,
            target: item.name,
            type: "smoothstep",
            animated: isSelected,
            style: { stroke: isSelected ? "#834AC4" : "#666" },
          });
        }

        // Process children of this node
        createNodesAndEdges(item.name, x, level + 1);
      });
    };

    createNodesAndEdges(treeId, 0, 0);

    setNodes(newNodes);
    setEdges(newEdges);
  }, [items, treeId, t, theme, loadSavedSkills, setNodes, setEdges]);

  useEffect(() => {
    buildTree();
  }, [buildTree]);

  // Handle node click
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const item = items.find((i) => i.name === node.id);
      if (item) {
        setSelectedNode(item);
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height,
        });
        setShowTooltip(true);
      }
    },
    [items],
  );

  // Handle node selection (toggle selected state)
  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();

      const savedSkills = loadSavedSkills();
      const isSelected = savedSkills[node.id]?.nodeState === "selected";

      // Toggle selection state
      const updatedSkills = {
        ...savedSkills,
        [node.id]: {
          optional: false,
          nodeState: isSelected ? "default" : "selected",
        },
      };

      saveSkills(updatedSkills);
      buildTree(); // Rebuild the tree with updated selection states
    },
    [loadSavedSkills, saveSkills, buildTree],
  );

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowTooltip(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Controls />
          <Background color="#333" gap={16} />
          <Panel
            position="top-center"
            className="bg-gray-800 p-2 rounded-md shadow-md"
          >
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-gray-300">
              Double-click to select/deselect a technology
            </p>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>

      {/* Tooltip */}
      {showTooltip && selectedNode && (
        <div
          className="absolute z-50"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y + 10}px`,
            transform: "translateX(-50%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <NodeTooltip item={selectedNode} treeId={treeId} clan={clan} t={t} />
        </div>
      )}
    </div>
  );
};

export default ReactFlowTree;
