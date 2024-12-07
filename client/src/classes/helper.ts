import { CheckCollisionParams, CheckForCollisionParams } from "@/types/helper";

export function rectangularCollision({
  rectangle1,
  rectangle2,
}: CheckCollisionParams): boolean {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

export function checkForHouseCollision({
  housesMap = [],
  player,
  characterOffset = { x: 0, y: 0 },
}: CheckForCollisionParams): void {
  player.interactionAsset = null;


  for (const house of housesMap) {
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...house,
          position: {
            x: house.position.x + characterOffset.x,
            y: house.position.y + characterOffset.y,
          },
        },
      })
    ) {
      player.interactionAsset = house;
      console.log(house)
      break;
    }
  }
}

export function checkForTreeCollision({
  treeZones = [],
  player,
  characterOffset = { x: 0, y: 0 },
}: CheckForCollisionParams): void {
  player.interactionAsset = null;

  for (const tree of treeZones) {
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...tree,
          position: {
            x: tree.position.x + characterOffset.x,
            y: tree.position.y + characterOffset.y,
          },
        },
      })
    ) {
      player.interactionAsset = tree;
      break;
    }
  }
}

export function checkForCharacterCollision({
  characters = [],
  player,
  characterOffset = { x: 0, y: 0 },
}: CheckForCollisionParams): void {
  player.interactionAsset = null;

  for (const character of characters) {
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...character,
          position: {
            x: character.position.x + characterOffset.x,
            y: character.position.y + characterOffset.y,
          },
        },
      })
    ) {
      player.interactionAsset = character;
      break;
    }
  }
}
