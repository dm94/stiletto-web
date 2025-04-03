import type React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import SkillNodeBtn from "./SkillNodeBtn";
import { getItemUrl } from "../../functions/utils";
import { getStoredItem, storeItem } from "../../functions/services";
import type { Item } from "../../types/item";
import type { Tree } from "../../types/dto/tech";
import "./ModernSkillTree.css";

interface NodeData {
  id: string;
  title: string;
  item: Item;
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
  items: Item[];
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
  const [skills, setSkills] = useState<
    Record<string, { optional: boolean; nodeState: string }>
  >({});
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

  // Load saved skills from storage
  useEffect(() => {
    try {
      const savedSkills = getStoredItem(`skills-${treeId}`);
      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      }
    } catch (error) {
      console.error("Error loading saved skills:", error);
    }
  }, [treeId]);

  // Build tree structure from items
  const buildTreeData = useCallback(() => {
    const buildChildren = (parent: string, level = 0): NodeData[] => {
      const filteredItems = items.filter((item) => item.parent === parent);

      const children: NodeData[] = filteredItems.map((item) => ({
        id: item.name,
        title: t(item.name),
        item,
        children: buildChildren(item.name, level + 1),
        level,
        x: 0,
        y: 0,
        selected: skills[item.name]?.nodeState === "selected",
        parentId: parent !== treeId ? parent : undefined,
      }));

      return children;
    };

    return buildChildren(treeId);
  }, [items, skills, t, treeId]);

  // Calculate node positions for horizontal layout
  const calculateNodePositions = useCallback((treeData: NodeData[]) => {
    const horizontalSpacing = 180;
    const verticalSpacing = 100;
    const processedNodes: NodeData[] = [];
    const processedEdges: EdgeData[] = [];

    // Process nodes level by level for horizontal layout
    const processLevel = (nodes: NodeData[], level: number, startY: number) => {
      const levelNodes = nodes.filter((node) => node.level === level);
      if (levelNodes.length === 0) {
        return;
      }

      // Calculate vertical positioning
      const totalHeight = (levelNodes.length - 1) * verticalSpacing;
      let currentY = startY - totalHeight / 2;

      for (const node of levelNodes) {
        // Set horizontal position based on level
        const x = 100 + level * horizontalSpacing;
        const y = currentY;

        const updatedNode = {
          ...node,
          x,
          y,
        };

        processedNodes.push(updatedNode);

        // Create edge if node has a parent
        if (node.parentId) {
          const parentNode = processedNodes.find((n) => n.id === node.parentId);
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

      // Process next level
      processLevel(nodes, level + 1, startY);
    };

    // Flatten the tree for easier processing
    const flattenTree = (nodes: NodeData[]): NodeData[] => {
      return nodes.reduce((acc, node) => {
        return [...acc, node, ...flattenTree(node.children)];
      }, [] as NodeData[]);
    };

    const flatNodes = flattenTree(treeData);

    // Start processing from level 0
    processLevel(flatNodes, 0, 300);

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
      // Find the node in our nodes array
      const node = nodes.find((n) => n.id === nodeId);
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
    [nodes, skills],
  );

  // Toggle node selection
  const toggleNode = useCallback(
    (nodeId: string) => {
      console.log("Toggling node:", nodeId);

      setSkills((prevSkills) => {
        const newSkills = { ...prevSkills };

        // If node is already selected, deselect it
        if (newSkills[nodeId]?.nodeState === "selected") {
          newSkills[nodeId] = { optional: false, nodeState: "unlocked" };
        } else {
          // Check if this node can be learned (parent is selected)
          const node = nodes.find((n) => n.id === nodeId);
          if (node?.parentId) {
            // If parent is not selected, don't allow selection
            if (prevSkills[node.parentId]?.nodeState !== "selected") {
              return prevSkills;
            }
          }

          // Otherwise select it
          newSkills[nodeId] = { optional: false, nodeState: "selected" };
        }

        // Save to storage
        storeItem(`skills-${treeId}`, JSON.stringify(newSkills));

        return newSkills;
      });
    },
    [treeId, nodes],
  );

  // Show tooltip
  const showTooltip = useCallback((nodeId: string) => {
    setTooltipInfo({
      visible: true,
      nodeId,
    });
  }, []);

  // Generate tooltip content
  const getTooltipContent = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) {
        return null;
      }

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
    [clan, nodes, t, treeId],
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

  // Calculate container dimensions
  const containerDimensions = useMemo(() => {
    if (nodes.length === 0) {
      return { width: 1000, height: 600 };
    }

    const maxX = Math.max(...nodes.map((n) => n.x)) + 100;
    const maxY = Math.max(...nodes.map((n) => n.y)) + 100;

    return { width: maxX, height: maxY };
  }, [nodes]);

  return (
    <div className="modern-skill-tree p-6 bg-charcoal rounded-lg border-2 border-tribal">
      <h2 className="text-2xl font-bold mb-6 text-sand font-['Okami'] border-b-2 border-tribal pb-2">
        {title}
      </h2>

      <div
        ref={containerRef}
        className="skill-tree-wrapper"
        style={{
          minHeight: `${containerDimensions.height}px`,
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
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);

              if (!fromNode || !toNode) {
                return null;
              }

              // Calculate positions for the path
              const x1 = fromNode.x + 60; // Right side of the node
              const y1 = fromNode.y + 50; // Middle of the node
              const x2 = toNode.x; // Left side of the node
              const y2 = toNode.y + 50; // Middle of the node

              // Calculate control points for the curve
              const midX = (x1 + x2) / 2;

              // Create a curved path
              const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

              // Determine if this is a selected path
              const strokeColor = edge.selected ? "#9b6ad8" : "#262625";
              const strokeWidth = edge.selected ? 3 : 2;

              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={path}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            // Determine if node can be learned
            const canLearn = canLearnNode(node.id);
            const nodeClass = node.selected
              ? "selected"
              : !canLearn && node.parentId
                ? "locked"
                : "";

            return (
              <button
                type="button"
                key={node.id}
                className={`skill-node ${nodeClass}`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  zIndex: node.selected ? 10 : 5,
                }}
                onClick={() => toggleNode(node.id)}
                onMouseEnter={() => showTooltip(node.id)}
                title={
                  !canLearn && node.parentId
                    ? t("techTree.needParentSkill")
                    : ""
                }
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
