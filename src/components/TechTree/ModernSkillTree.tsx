import type React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import SkillNodeBtn from "./SkillNodeBtn";
import { getItemUrl } from "@functions/utils";
import { getStoredItem, storeItem } from "@functions/services";
import type { TechItem } from "@ctypes/item";
import type { Tree } from "@ctypes/dto/tech";
import type { SkillStateMap } from "@ctypes/Skill";
import "../../styles/ModernSkillTree.css";

interface NodeData {
  id: string;
  title: string;
  item: TechItem;
  children: NodeData[];
  level: number;
  x: number;
  y: number;
  selected: boolean;
  parentId?: string;
}

interface EdgeData {
  from: string;
  to: string;
  selected: boolean;
}

interface ModernSkillTreeProps {
  treeId: Tree;
  title: string;
  items: TechItem[];
  clan?: number;
}

const ModernSkillTree: React.FC<ModernSkillTreeProps> = ({
  treeId,
  title,
  items,
  clan,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);

  // Create an O(1) lookup Map for nodes by their ID to avoid repeated O(N) array scans.
  const nodesMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const [skills, setSkills] = useState<SkillStateMap>({});
  const [tooltipInfo, setTooltipInfo] = useState<{
    visible: boolean;
    nodeId: string;
  }>({
    visible: false,
    nodeId: "",
  });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Group tech items by parent to enable O(1) map lookup during tree construction,
  // preventing O(N^2) complexity with array scans.
  const itemsByParent = useMemo(() => {
    const map = new Map<string, TechItem[]>();
    for (const item of items) {
      if (item.parent) {
        let list = map.get(item.parent);
        if (!list) {
          list = [];
          map.set(item.parent, list);
        }
        list.push(item);
      }
    }
    return map;
  }, [items]);

  // Build tree structure from items
  const buildTreeData = useCallback(() => {
    const buildChildren = (parent: string, level = 0): NodeData[] => {
      // O(1) lookup from pre-grouped map instead of filtering the whole array
      const filteredItems = itemsByParent.get(parent) || [];

      const children: NodeData[] = filteredItems.map((item) => ({
        id: item.name,
        title: t(item.name),
        item,
        children: buildChildren(item.name, level + 1),
        level,
        x: 0,
        y: 0,
        selected: skills[item.name]?.nodeState === "selected",
        parentId: parent === treeId ? undefined : parent,
      }));

      return children;
    };

    return buildChildren(treeId);
  }, [itemsByParent, skills, t, treeId]);

  // Calculate node positions for horizontal layout
  const calculateNodePositions = useCallback((treeData: NodeData[]) => {
    const horizontalSpacing = 180;
    const verticalSpacing = 110;
    const processedNodes: NodeData[] = [];
    const processedEdges: EdgeData[] = [];
    // Maintain a map of processed nodes to perform O(1) parentNode lookups rather than O(N) scans.
    const processedNodesMap = new Map<string, NodeData>();

    // Flatten the tree for easier processing using O(N) linear recursion (avoiding array spreading overhead)
    const flattenTree = (
      nodesList: NodeData[],
      acc: NodeData[] = [],
    ): NodeData[] => {
      for (const node of nodesList) {
        acc.push(node);
        flattenTree(node.children, acc);
      }
      return acc;
    };

    const flatNodes = flattenTree(treeData);

    // Group nodes by their level to enable O(1) map lookup during layout processing,
    // avoiding the O(N^2) complexity of scanning flatNodes for each level.
    const nodesByLevel = new Map<number, NodeData[]>();
    for (let i = 0; i < flatNodes.length; i++) {
      const node = flatNodes[i];
      let levelList = nodesByLevel.get(node.level);
      if (!levelList) {
        levelList = [];
        nodesByLevel.set(node.level, levelList);
      }
      levelList.push(node);
    }

    // Process nodes level by level for horizontal layout
    const processLevel = (level: number, startY: number) => {
      const levelNodes = nodesByLevel.get(level) || [];
      if (levelNodes.length === 0) {
        return;
      }

      // Calculate vertical positioning
      const totalHeight = (levelNodes.length - 1) * verticalSpacing;
      let currentY = startY - totalHeight / 2;

      for (let i = 0; i < levelNodes.length; i++) {
        const node = levelNodes[i];
        // Set horizontal position based on level
        const x = 100 + level * horizontalSpacing;
        const y = currentY;

        const updatedNode = {
          ...node,
          x,
          y,
        };

        processedNodes.push(updatedNode);
        processedNodesMap.set(updatedNode.id, updatedNode);

        // Create edge if node has a parent
        if (node.parentId) {
          const parentNode = processedNodesMap.get(node.parentId);
          if (parentNode) {
            processedEdges.push({
              from: parentNode.id,
              to: node.id,
              selected: parentNode.selected && node.selected,
            });
          }
        }

        currentY += verticalSpacing;
      }

      // Process next level using O(1) level lookup
      processLevel(level + 1, startY);
    };

    // Start processing from level 0
    processLevel(0, 300);

    return { nodes: processedNodes, edges: processedEdges };
  }, []);

  // Update nodes and edges when items or skills change
  useEffect(() => {
    const treeData = buildTreeData();
    const { nodes: calculatedNodes, edges: calculatedEdges } =
      calculateNodePositions(treeData);

    setNodes(calculatedNodes);
    setEdges(calculatedEdges);
  }, [buildTreeData, calculateNodePositions]);

  // Check if a node can be learned based on its parent's status
  const canLearnNode = useCallback(
    (nodeId: string): boolean => {
      // Find the node using our O(1) Map
      const node = nodesMap.get(nodeId);
      if (!node) {
        return false;
      }

      // If node has no parent, it can always be learned
      if (!node.parentId) {
        return true;
      }

      // Check if parent node is selected
      return skills[node.parentId]?.nodeState === "selected";
    },
    [nodesMap, skills],
  );

  const toggleNode = useCallback(
    (nodeId: string) => {
      setSkills((prevSkills) => {
        const newSkills = { ...prevSkills };

        if (newSkills[nodeId]?.nodeState === "selected") {
          newSkills[nodeId] = { nodeState: "unlocked" };
        } else {
          const node = nodesMap.get(nodeId);
          if (
            node?.parentId &&
            prevSkills[node.parentId]?.nodeState !== "selected"
          ) {
            return prevSkills;
          }

          // Otherwise select it
          newSkills[nodeId] = { nodeState: "selected" };
        }

        storeItem(`skills-${treeId}`, JSON.stringify(newSkills));

        return newSkills;
      });
    },
    [treeId, nodesMap],
  );

  const showTooltip = useCallback((nodeId: string) => {
    setTooltipInfo({
      visible: true,
      nodeId,
    });
  }, []);

  const getTooltipContent = useCallback(
    (nodeId: string) => {
      const node = nodesMap.get(nodeId);
      if (!node) {
        return null;
      }

      const canLearn = canLearnNode(nodeId);

      return (
        <div className="mx-auto">
          <div className="text-center mb-1">
            <a
              href={getItemUrl(node.id)}
              target="_blank"
              rel="noopener noreferrer"
              title={node.id}
            >
              <Icon key={node.id} name={node.id} width={35} />
              {node.id}
            </a>
          </div>
          <div className="text-center mb-2">
            {node.item?.level && (
              <p className="text-sm text-sandLight mb-1">
                <span className="font-bold">{t("techTree.level")}: </span>
                {node.item.level}
              </p>
            )}
            {node.item?.pointsCost && (
              <p className="text-sm text-sandLight mb-1">
                <span className="font-bold">{t("techTree.pointsCost")}: </span>
                {node.item.pointsCost}
              </p>
            )}
          </div>
          {canLearn && (
            <button
              type="button"
              className="btn btn-sm my-2 p-2"
              onClick={() => toggleNode(node.id)}
            >
              {t("techTree.toggleLearned")}
            </button>
          )}
          <p className="text-center border-b border-warning">
            {t("crafting.whoHasLearnedIt")}
          </p>
          {clan ? (
            <SkillNodeBtn
              key={`btn-${node.id}`}
              item={node.item}
              clan={clan}
              tree={treeId}
            />
          ) : (
            t("techTree.needClanForFunction")
          )}
        </div>
      );
    },
    [clan, nodesMap, t, treeId, toggleNode, canLearnNode],
  );

  // Zoom controls
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    try {
      const savedSkills = getStoredItem(`skills-${treeId}`);
      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      }
    } catch (error) {
      console.error("Error loading saved skills:", error);
    }

    resetZoom();
  }, [treeId, resetZoom]);

  // Pan functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Calculate container dimensions and offsets
  const containerDimensions = useMemo(() => {
    if (nodes.length === 0) {
      return { width: 1000, height: 600, offsetX: 0, offsetY: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.x < minX) {
        minX = node.x;
      }
      if (node.y < minY) {
        minY = node.y;
      }
      if (node.x > maxX) {
        maxX = node.x;
      }
      if (node.y > maxY) {
        maxY = node.y;
      }
    }

    const maxXWithPadding = maxX + 100;
    const maxYWithPadding = maxY + 100;

    // Offset to ensure all nodes are visible (no negative positions)
    const offsetX = minX < 0 ? -minX + 20 : 0;
    const offsetY = minY < 0 ? -minY + 20 : 0;
    return {
      width: maxXWithPadding + offsetX,
      height: maxYWithPadding + offsetY,
      offsetX,
      offsetY,
    };
  }, [nodes]);

  return (
    <div className="modern-skill-tree p-6 bg-charcoal rounded-lg border-2 border-tribal">
      <h2 className="text-2xl font-bold mb-6 text-sand font-okami border-b-2 border-tribal pb-2">
        {title}
      </h2>

      <div
        tabIndex={-1}
        ref={containerRef}
        role="tree"
        className="skill-tree-wrapper"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="connections-container"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            width: containerDimensions.width,
            height: containerDimensions.height,
            transformOrigin: "0 0",
          }}
        >
          <svg
            width="100%"
            height="100%"
            className="absolute top-0 left-0 pointer-events-none"
          >
            <title>Lines</title>
            {edges.map((edge) => {
              const fromNode = nodesMap.get(edge.from);
              const toNode = nodesMap.get(edge.to);

              if (!fromNode || !toNode) {
                return null;
              }

              // Apply offset to all node positions
              const x1 = fromNode.x + 60 + containerDimensions.offsetX; // Right side of the node
              const y1 = fromNode.y + 50 + containerDimensions.offsetY; // Middle of the node
              const x2 = toNode.x + containerDimensions.offsetX; // Left side of the node
              const y2 = toNode.y + 50 + containerDimensions.offsetY; // Middle of the node

              // Calculate control points for the curve
              const midX = (x1 + x2) / 2;

              // Create a curved path
              const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

              // Determine if this is a selected path
              const strokeColor = edge.selected ? "#2ecc2e" : "#d95f32";
              const strokeWidth = edge.selected ? 4 : 2;
              const strokeOpacity = edge.selected ? 1 : 0.5;
              const glowFilter = edge.selected ? "url(#glow)" : undefined;

              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={path}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  filter={glowFilter}
                  fill="none"
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            // Determine if node can be learned

            // Extract the nested ternary into a separate statement
            let nodeClass = "";
            if (node.selected) {
              nodeClass = "selected";
            }

            return (
              <button
                type="button"
                key={node.id}
                className={`skill-node ${nodeClass}`}
                style={{
                  left: `${node.x + containerDimensions.offsetX}px`,
                  top: `${node.y + containerDimensions.offsetY}px`,
                  zIndex: node.selected ? 10 : 5,
                }}
                onClick={() => showTooltip(node.id)}
              >
                <div className="node-title">{node.title}</div>
              </button>
            );
          })}
        </div>

        {tooltipInfo.visible && (
          <div className="skill-tooltip">
            {getTooltipContent(tooltipInfo.nodeId)}
          </div>
        )}

        {/* Zoom controls */}
        <div className="zoom-controls">
          <button
            type="button"
            className="zoom-btn"
            onClick={zoomIn}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="zoom-btn"
            onClick={zoomOut}
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            type="button"
            className="zoom-btn"
            onClick={resetZoom}
            aria-label="Reset zoom"
          >
            ↺
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernSkillTree;
