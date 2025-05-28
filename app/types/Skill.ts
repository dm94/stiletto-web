/**
 * Represents the state of a skill node in the skill tree.
 */
export interface SkillState {
  nodeState: string;
}

/**
 * A record mapping skill IDs to their states.
 */
export type SkillStateMap = Record<string, SkillState>;
