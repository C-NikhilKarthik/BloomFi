export type Position = {
  x: number;
  y: number;
};

export type Rectangle = {
  position: Position;
  width: number;
  height: number;
};

export type Player = Rectangle & {
  interactionAsset: object | null;
};

export type CharacterOffset = {
  x: number;
  y: number;
};

export type InteractionAsset = {
  position: Position;
  width: number;
  height: number;
};

export type CheckCollisionParams = {
  rectangle1: Rectangle;
  rectangle2: Rectangle;
};

export type CheckForCollisionParams = {
  housesMap?: InteractionAsset[];
  treeZones?: InteractionAsset[];
  characters?: InteractionAsset[];
  player: Player;
  characterOffset?: CharacterOffset;
};
