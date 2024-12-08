function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

function checkForHouseCollision({
  housesMap,
  player,
  characterOffset = { x: 0, y: 0 }
}) {
  player.interactionAsset = null
  // monitor for character collision
  let houseVal = -1;
  // console.log(housesMap)
  for (let i = 0; i < housesMap.length; i++) {
    const house = housesMap[i]
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...house,
          position: {
            x: house.position.x + characterOffset.x,
            y: house.position.y + characterOffset.y
          }
        }
      })
    ) {
      player.interactionAsset = house
      houseVal = i;
      break
    }
  }

  return houseVal;
}

// function checkForTreeCollision({
//   treeZones,
//   player,
//   characterOffset = { x: 0, y: 0 },
// }) {
//   player.interactionAsset = null
//   // monitor for character collision
//   for (let i = 0; i < treeZones.length; i++) {
//     const tree = treeZones[i]
//     if (
//       rectangularCollision({
//         rectangle1: player,
//         rectangle2: {
//           ...tree,
//           position: {
//             x: tree.position.x + characterOffset.x,
//             y: tree.position.y + characterOffset.y
//           }
//         }
//       })
//     ) {
//       player.interactionAsset = tree
//       // console.log(tree)
//       return i

//       // console.log(treeVal)
//     } else {
//       return -1
//     }
//   }
// }

function checkForTreeCollision({
  treeZones,
  player,
  characterOffset = { x: 0, y: 0 }
}) {
  player.interactionAsset = null;
  let newTreeVal = -1;

  for (let i = 0; i < treeZones.length; i++) {
    const tree = treeZones[i];
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...tree,
          position: {
            x: tree.position.x + characterOffset.x,
            y: tree.position.y + characterOffset.y
          }
        }
      })
    ) {
      player.interactionAsset = tree;
      newTreeVal = i;
      break;
    }
  }

  return newTreeVal;
}




function checkForCharacterCollision({
  characters,
  player,
  characterOffset = { x: 0, y: 0 }
}) {
  player.interactionAsset = null
  // monitor for character collision
  for (let i = 0; i < characters.length; i++) {
    const character = characters[i]

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...character,
          position: {
            x: character.position.x + characterOffset.x,
            y: character.position.y + characterOffset.y
          }
        }
      })
    ) {
      player.interactionAsset = character
      break
    }
  }
}
