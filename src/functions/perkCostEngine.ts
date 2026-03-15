import type { Perk } from "@ctypes/perk";

export type PerkGraph = {
  byName: Map<string, Perk>;
  childrenByParent: Map<string, string[]>;
  roots: Set<string>;
};

const createCycleError = (perkName: string): Error =>
  new Error(`Cycle detected in perk dependencies at "${perkName}"`);

export const buildPerkGraph = (perks: Perk[]): PerkGraph => {
  const byName = new Map<string, Perk>();
  const childrenByParent = new Map<string, string[]>();
  const roots = new Set<string>();

  for (const perk of perks) {
    byName.set(perk.name, perk);
  }

  for (const perk of perks) {
    const parentName = perk.parent;

    if (parentName == null) {
      roots.add(perk.name);
      continue;
    }

    const children = childrenByParent.get(parentName) ?? [];
    children.push(perk.name);
    childrenByParent.set(parentName, children);

    if (!byName.has(parentName)) {
      roots.add(parentName);
    }
  }

  return { byName, childrenByParent, roots };
};

export const getRequiredChain = (
  perkName: string,
  graph: PerkGraph,
): string[] => {
  const chain: string[] = [];
  const visited = new Set<string>([perkName]);
  let currentPerk = graph.byName.get(perkName);

  while (currentPerk?.parent != null) {
    const parentName = currentPerk.parent;

    if (visited.has(parentName)) {
      throw createCycleError(parentName);
    }
    visited.add(parentName);

    const parentPerk = graph.byName.get(parentName);
    if (parentPerk == null) {
      break;
    }

    chain.unshift(parentName);
    currentPerk = parentPerk;
  }

  return chain;
};

const getSelectionClosure = (
  selectedPerks: ReadonlySet<string>,
  graph: PerkGraph,
): Set<string> => {
  const closure = new Set<string>();

  for (const perkName of selectedPerks) {
    if (!graph.byName.has(perkName)) {
      continue;
    }

    closure.add(perkName);
    const requiredChain = getRequiredChain(perkName, graph);
    for (const requiredPerk of requiredChain) {
      closure.add(requiredPerk);
    }
  }

  return closure;
};

export const computeTotalCost = (
  selectedPerks: ReadonlySet<string>,
  graph: PerkGraph,
): number => {
  const closure = getSelectionClosure(selectedPerks, graph);
  let totalCost = 0;

  for (const perkName of closure) {
    const perk = graph.byName.get(perkName);
    totalCost += perk?.cost ?? 0;
  }

  return totalCost;
};

export const canSelect = (
  perkName: string,
  selectedSet: ReadonlySet<string>,
  graph: PerkGraph,
): boolean => {
  const perk = graph.byName.get(perkName);
  if (perk == null) {
    return false;
  }

  if (perk.parent == null) {
    return true;
  }

  if (!graph.byName.has(perk.parent)) {
    return true;
  }

  return selectedSet.has(perk.parent);
};

const removeInvalidDescendants = (
  targetSet: Set<string>,
  rootPerkName: string,
  graph: PerkGraph,
): void => {
  const pendingNames = [...(graph.childrenByParent.get(rootPerkName) ?? [])];

  while (pendingNames.length > 0) {
    const currentName = pendingNames.pop();
    if (currentName == null) {
      continue;
    }

    targetSet.delete(currentName);

    const children = graph.childrenByParent.get(currentName) ?? [];
    for (const childName of children) {
      pendingNames.push(childName);
    }
  }
};

export const togglePerk = (
  perkName: string,
  selectedSet: ReadonlySet<string>,
  graph: PerkGraph,
): Set<string> => {
  if (!graph.byName.has(perkName)) {
    return new Set(selectedSet);
  }

  const nextSelection = new Set(selectedSet);

  if (nextSelection.has(perkName)) {
    nextSelection.delete(perkName);
    removeInvalidDescendants(nextSelection, perkName, graph);
    return nextSelection;
  }

  const requiredChain = getRequiredChain(perkName, graph);
  for (const requiredPerk of requiredChain) {
    nextSelection.add(requiredPerk);
  }
  nextSelection.add(perkName);

  return nextSelection;
};
