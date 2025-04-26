export type Creature = {
  name: string;
  category?: string;
};

export type CreatureDrop = {
  name: string;
  chance?: number;
  minQuantity?: number;
  maxQuantity?: number;
};

export type CreatureCompleteInfo = {
  name: string;
  category?: string;
  health?: number;
  tier?: string;
  experiencie?: number;
  drops?: CreatureDrop[];
};
