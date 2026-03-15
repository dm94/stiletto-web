import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PerkGraph } from "@functions/perkCostEngine";
import { canSelect } from "@functions/perkCostEngine";
import "../../styles/PerkTree.css";

type PerkTreeProps = {
  activeRoot: string;
  graph: PerkGraph;
  selectedPerks: ReadonlySet<string>;
  onTogglePerk: (perkName: string) => void;
};

type NodeData = {
  id: string;
  level: number;
  parentId?: string;
  x: number;
  y: number;
};

type EdgeData = {
  from: string;
  to: string;
  selected: boolean;
};

const HORIZONTAL_SPACING = 190;
const VERTICAL_SPACING = 120;
const NODE_SIZE = 110;

const PerkTree = ({
  activeRoot,
  graph,
  selectedPerks,
  onTogglePerk,
}: PerkTreeProps) => {
  const { t } = useTranslation();
  const [focusedNodeId, setFocusedNodeId] = useState<string>();

  const treeData = useMemo(() => {
    const rootChildren = graph.childrenByParent.get(activeRoot) ?? [];
    const nodes: NodeData[] = [];
    const edges: EdgeData[] = [];
    const byLevel = new Map<number, string[]>();

    const walk = (perkName: string, level: number, parentId?: string): void => {
      nodes.push({ id: perkName, level, parentId, x: 0, y: 0 });

      const levelNodes = byLevel.get(level) ?? [];
      levelNodes.push(perkName);
      byLevel.set(level, levelNodes);

      if (parentId != null) {
        edges.push({
          from: parentId,
          to: perkName,
          selected: selectedPerks.has(parentId) && selectedPerks.has(perkName),
        });
      }

      const children = graph.childrenByParent.get(perkName) ?? [];
      for (const childName of children) {
        walk(childName, level + 1, perkName);
      }
    };

    for (const nodeName of rootChildren) {
      walk(nodeName, 0);
    }

    const nodesByLevel = new Map<number, NodeData[]>();
    for (const node of nodes) {
      const levelNodes = nodesByLevel.get(node.level) ?? [];
      levelNodes.push(node);
      nodesByLevel.set(node.level, levelNodes);
    }

    for (const [level, levelNodes] of nodesByLevel) {
      const totalHeight = (levelNodes.length - 1) * VERTICAL_SPACING;
      let currentY = 110 - totalHeight / 2;

      for (const node of levelNodes) {
        node.x = 80 + level * HORIZONTAL_SPACING;
        node.y = currentY;
        currentY += VERTICAL_SPACING;
      }
    }

    return { nodes, edges };
  }, [activeRoot, graph, selectedPerks]);

  const dimensions = useMemo(() => {
    if (treeData.nodes.length === 0) {
      return { width: 1000, height: 500, offsetX: 0, offsetY: 0 };
    }

    const minX = Math.min(...treeData.nodes.map((node) => node.x));
    const minY = Math.min(...treeData.nodes.map((node) => node.y));
    const maxX = Math.max(...treeData.nodes.map((node) => node.x)) + NODE_SIZE;
    const maxY = Math.max(...treeData.nodes.map((node) => node.y)) + NODE_SIZE;
    const offsetX = minX < 0 ? -minX + 24 : 0;
    const offsetY = minY < 0 ? -minY + 24 : 0;

    return {
      width: maxX + offsetX + 24,
      height: maxY + offsetY + 24,
      offsetX,
      offsetY,
    };
  }, [treeData.nodes]);

  const focusedPerk = focusedNodeId
    ? graph.byName.get(focusedNodeId)
    : undefined;
  const canToggleFocused = focusedNodeId
    ? selectedPerks.has(focusedNodeId) ||
      canSelect(focusedNodeId, selectedPerks, graph)
    : false;

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setFocusedNodeId(nodeId);

      const canToggle =
        selectedPerks.has(nodeId) || canSelect(nodeId, selectedPerks, graph);
      if (!canToggle) {
        return;
      }

      onTogglePerk(nodeId);
    },
    [graph, onTogglePerk, selectedPerks],
  );

  return (
    <div className="perk-tree-shell">
      <div
        className="perk-tree-stage"
        role="tree"
        aria-label={t("perksCalculator.tree.ariaLabel", { root: activeRoot })}
      >
        <div
          className="perk-tree-canvas"
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
        >
          <svg width="100%" height="100%" className="perk-tree-lines">
            <title>{t("perksCalculator.tree.dependencies")}</title>
            {treeData.edges.map((edge) => {
              const fromNode = treeData.nodes.find(
                (node) => node.id === edge.from,
              );
              const toNode = treeData.nodes.find((node) => node.id === edge.to);

              if (fromNode == null || toNode == null) {
                return null;
              }

              const x1 = fromNode.x + NODE_SIZE / 2 + dimensions.offsetX;
              const y1 = fromNode.y + NODE_SIZE / 2 + dimensions.offsetY;
              const x2 = toNode.x + NODE_SIZE / 2 + dimensions.offsetX;
              const y2 = toNode.y + NODE_SIZE / 2 + dimensions.offsetY;
              const curveX = (x1 + x2) / 2;
              const curvePath = `M ${x1} ${y1} C ${curveX} ${y1}, ${curveX} ${y2}, ${x2} ${y2}`;

              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={curvePath}
                  stroke={edge.selected ? "#2ecc2e" : "#d95f32"}
                  strokeWidth={edge.selected ? 4 : 2}
                  strokeOpacity={edge.selected ? 1 : 0.5}
                  fill="none"
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {treeData.nodes.map((node) => {
            const isSelected = selectedPerks.has(node.id);
            const isSelectable = canSelect(node.id, selectedPerks, graph);
            const isLocked = !isSelected && !isSelectable;

            let stateClass = "available";
            if (isSelected) {
              stateClass = "selected";
            } else if (isLocked) {
              stateClass = "locked";
            }
            const isActiveNode = focusedNodeId === node.id;

            return (
              <button
                type="button"
                key={node.id}
                className={`perk-node ${stateClass} ${isActiveNode ? "active" : ""}`}
                style={{
                  left: `${node.x + dimensions.offsetX}px`,
                  top: `${node.y + dimensions.offsetY}px`,
                }}
                onClick={() => handleNodeClick(node.id)}
                aria-pressed={isSelected}
                aria-label={t("perksCalculator.tree.nodeAriaLabel", {
                  nodeName: node.id,
                })}
              >
                <span className="perk-node-title">{node.id}</span>
                <span className="perk-node-cost">
                  {graph.byName.get(node.id)?.cost ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="perk-tree-detail">
        {focusedPerk == null ? (
          <p className="text-gray-300">
            {t("perksCalculator.tree.selectNodeHelp")}
          </p>
        ) : (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-sand">
              {focusedPerk.name}
            </h3>
            <p className="text-gray-300 text-sm">{focusedPerk.description}</p>
            <p className="text-gray-200 text-sm">
              {t("perksCalculator.tree.cost")}:{" "}
              <span className="font-semibold text-yellow-300">
                {focusedPerk.cost}
              </span>
            </p>
            <button
              type="button"
              className={`w-full px-4 py-2 rounded-md font-semibold transition-colors ${
                canToggleFocused
                  ? "bg-green-600 text-white hover:bg-green-500"
                  : "bg-gray-700 text-gray-300 cursor-not-allowed"
              }`}
              onClick={() => {
                if (canToggleFocused) {
                  onTogglePerk(focusedPerk.name);
                }
              }}
              disabled={!canToggleFocused}
              aria-pressed={selectedPerks.has(focusedPerk.name)}
            >
              {selectedPerks.has(focusedPerk.name)
                ? t("perksCalculator.tree.actions.deselectPerk")
                : t("perksCalculator.tree.actions.selectPerk")}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default PerkTree;
