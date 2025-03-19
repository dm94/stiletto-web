export enum TypeRelationship {
  NAP = 0,
  ALLY = 1,
  WAR = 2,
  FALSE_NAP = 30,
  FALSE_ALLY = 31,
  FALSE_WAR = 32,
}

export type CreateRelationshipRequestQueryParams = {
  typed: TypeRelationship;
  clanflag?: string;
  nameotherclan: string;
  symbol?: string;
};
