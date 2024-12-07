const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 150) {
  collisionsMap.push(collisions.slice(i, 150 + i))
}

// const battleZonesMap = []
// for (let i = 0; i < battleZonesData.length; i += 150) {
//   battleZonesMap.push(battleZonesData.slice(i, 150 + i))
// }

// const charactersMap = []
// for (let i = 0; i < charactersMapData.length; i += 150) {
//   charactersMap.push(charactersMapData.slice(i, 150 + i))
// }

const houseMap = []
for (let i = 0; i < houses.length; i += 150) {
  houseMap.push(houses.slice(i, 150 + i))
}

const treeNumber = 30
const treeMap = []
for (let i = 0; i < trees.length; i += 150) {
  treeMap.push(trees.slice(i, 150 + i))
}
console.log(treeMap)

const boundaries = []
const offset = {
  x: -900,
  y: -700
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

const housesMap = []
houseMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol !== 0)
      housesMap.push(
        new House({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          dialogue: ['...', 'Hey mister, have you seen my Doggochu?']
        })
      )
  })
})


const tree1Image = new Image()
tree1Image.src = './img/tree1.png'

const tree2Image = new Image()
tree2Image.src = './img/tree2.png'

const tree3Image = new Image()
tree3Image.src = './img/tree3.png'

const treeZones = []
treeMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 258)
      treeZones.push(
        new Sprite({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          scale: 3.2,
          image: tree1Image
        })
      )

    if (symbol === 294)
      treeZones.push(
        new Sprite({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          scale: 3.2,
          image: tree2Image
        })
      )

  })
})

function getRandomTreeZones(treeZones, treeNumber) {
  const selectedZones = [];
  const usedIndices = new Set();

  while (selectedZones.length < treeNumber && usedIndices.size < treeZones.length) {
    const randomIndex = Math.floor(Math.random() * treeZones.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedZones.push(treeZones[randomIndex]);
    }
  }

  return selectedZones;
}
const newTreeZones = getRandomTreeZones(treeZones, treeNumber);
treeZones.length = 0; // Clear original treeZones
treeZones.push(...newTreeZones);
console.log(treeZones)

// const battleZones = []

// battleZonesMap.forEach((row, i) => {
//   row.forEach((symbol, j) => {
//     if (symbol === 1025)
//       battleZones.push(
//         new Boundary({
//           position: {
//             x: j * Boundary.width + offset.x,
//             y: i * Boundary.height + offset.y
//           }
//         })
//       )
//   })
// })

// const characters = []
// const villagerImg = new Image()
// villagerImg.src = './img/villager/Idle.png'

// const oldManImg = new Image()
// oldManImg.src = './img/oldMan/Idle.png'

// charactersMap.forEach((row, i) => {
//   row.forEach((symbol, j) => {
//     // 1026 === villager
//     if (symbol === 1026) {
//       characters.push(
//         new Character({
//           position: {
//             x: j * Boundary.width + offset.x,
//             y: i * Boundary.height + offset.y
//           },
//           image: villagerImg,
//           frames: {
//             max: 4,
//             hold: 60
//           },
//           scale: 3,
//           animate: true,
//           dialogue: ['...', 'Hey mister, have you seen my Doggochu?']
//         })
//       )
//     }
//     // 1031 === oldMan
//     else if (symbol === 1031) {
//       characters.push(
//         new Character({
//           position: {
//             x: j * Boundary.width + offset.x,
//             y: i * Boundary.height + offset.y
//           },
//           image: oldManImg,
//           frames: {
//             max: 4,
//             hold: 60
//           },
//           scale: 3,
//           dialogue: ['My bones hurt.']
//         })
//       )
//     }

//     if (symbol !== 0) {
//       boundaries.push(
//         new Boundary({
//           position: {
//             x: j * Boundary.width + offset.x,
//             y: i * Boundary.height + offset.y
//           }
//         })
//       )
//     }
//   })
// })

// const ho = []
// houseMap.forEach((row, i) => {
//   row.forEach((symbol, j) => {
//     // 1026 === villager
//     if (symbol !== 0) {
//       characters.push(
//         new Character({
//           position: {
//             x: j * Boundary.width + offset.x,
//             y: i * Boundary.height + offset.y
//           },
//           image: villagerImg,
//           frames: {
//             max: 4,
//             hold: 60
//           },
//           scale: 3,
//           animate: true,
//           dialogue: ['Hola!', 'Hello this is house']
//         })
//       )
//     }
//   })
// })

const image = new Image()
// image.src = './img/Pellet Town.png'
image.src = './img/GameMapFinal.png'

// const foregroundImage = new Image()
// foregroundImage.src = './img/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'



const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image
})

// const tree1 = []


// const foreground = new Sprite({
//   position: {
//     x: offset.x,
//     y: offset.y
//   },
//   image: foregroundImage
// })


const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

// console.log(housesMap.map(item => (item.position)))

const movables = [
  background,
  ...boundaries,
  ...housesMap,
  ...treeZones
  // foreground,
  // ...battleZones,
  // ...characters
]
const renderables = [
  background,
  ...boundaries,
  ...housesMap,
  // ...battleZones,
  // ...characters,
  player,
  ...treeZones
  // foreground
]

// const battle = {
//   initiated: false
// }

function animate() {
  const animationId = window.requestAnimationFrame(animate)
  renderables.forEach((renderable) => {
    renderable.draw()
  })

  let moving = true
  player.animate = false

  // if (battle.initiated) return

  // activate a battle
  // if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
  //   for (let i = 0; i < battleZones.length; i++) {
  //     const battleZone = battleZones[i]
  //     const overlappingArea =
  //       (Math.min(
  //         player.position.x + player.width,
  //         battleZone.position.x + battleZone.width
  //       ) -
  //         Math.max(player.position.x, battleZone.position.x)) *
  //       (Math.min(
  //         player.position.y + player.height,
  //         battleZone.position.y + battleZone.height
  //       ) -
  //         Math.max(player.position.y, battleZone.position.y))
  //     if (
  //       rectangularCollision({
  //         rectangle1: player,
  //         rectangle2: battleZone
  //       }) &&
  //       overlappingArea > (player.width * player.height) / 2 &&
  //       Math.random() < 0.01
  //     ) {
  //       // deactivate current animation loop
  //       window.cancelAnimationFrame(animationId)

  //       audio.Map.stop()
  //       audio.initBattle.play()
  //       audio.battle.play()

  //       battle.initiated = true
  //       gsap.to('#overlappingDiv', {
  //         opacity: 1,
  //         repeat: 3,
  //         yoyo: true,
  //         duration: 0.4,
  //         onComplete() {
  //           gsap.to('#overlappingDiv', {
  //             opacity: 1,
  //             duration: 0.4,
  //             onComplete() {
  //               // activate a new animation loop
  //               initBattle()
  //               animateBattle()
  //               gsap.to('#overlappingDiv', {
  //                 opacity: 0,
  //                 duration: 0.4
  //               })
  //             }
  //           })
  //         }
  //       })
  //       break
  //     }
  //   }
  // }

  if (keys.w.pressed && lastKey === 'w') {
    player.animate = true
    player.image = player.sprites.up

    // console.group(housesMap)

    checkForHouseCollision({
      housesMap,
      player,
      characterOffset: { x: 0, y: 3 }
    })

    if (player.interactionAsset === null) {

      checkForTreeCollision({
        treeZones,
        player,
        characterOffset: { x: 0, y: 3 }
      })
    }

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      // console.log(boundaries[i])
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        moving = false
        break
      }

    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
  } else if (keys.a.pressed && lastKey === 'a') {
    player.animate = true
    player.image = player.sprites.left

    checkForHouseCollision({
      housesMap,
      player,
      characterOffset: { x: 3, y: 0 }
    })

    if (player.interactionAsset === null) {

      checkForTreeCollision({
        treeZones,
        player,
        characterOffset: { x: 3, y: 0 }
      })
    }


    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
  } else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = player.sprites.down

    checkForHouseCollision({
      housesMap,
      player,
      characterOffset: { x: 0, y: -3 }
    })

    if (player.interactionAsset === null) {

      checkForTreeCollision({
        treeZones,
        player,
        characterOffset: { x: 0, y: -3 }
      })

    }

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
  } else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = player.sprites.right

    checkForHouseCollision({
      housesMap,
      player,
      characterOffset: { x: -3, y: 0 }
    })

    if (player.interactionAsset === null) {

      checkForTreeCollision({
        treeZones,
        player,
        characterOffset: { x: -3, y: 0 }
      })
    }

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
  }
}
// animate()

let lastKey = ''

window.addEventListener('keydown', (e) => {
  if (player.isInteracting) {
    switch (e.key) {
      case ' ':
        if (player.interactionAsset.type === 'House') {
          player.isInteracting = false
          player.interactionAsset.dialogueIndex = 0
          document.querySelector('#houseDialogueBox').style.display = 'none'

          break
        } else {
          // player.interactionAsset.dialogueIndex++

          // const { dialogueIndex, dialogue } = player.interactionAsset
          // if (dialogueIndex <= dialogue.length - 1) {
          //   document.querySelector('#characterDialogueBox').innerHTML =
          //     player.interactionAsset.dialogue[dialogueIndex]
          //   return
          // }

          // finish conversation
          // player.isInteracting = false
          // player.interactionAsset.dialogueIndex = 0
          // document.querySelector('#characterDialogueBox').style.display = 'none'

          // break
          document.querySelector('#characterDialogueBox').innerHTML = `
  <button id="deleteTreeButton">Delete Tree</button>
`;

          // Add the event listener for the delete button
          document.querySelector('#deleteTreeButton').addEventListener('click', () => {
            if (player.interactionAsset) {
              // Find and remove the tree from treeZones
              console.log(player.interactionAsset)
              const treeIndex = treeZones.indexOf(player.interactionAsset);
              console.log(treeIndex)
              // console.log(treeZones.indexOf(treeIndex))
              if (treeIndex > -1) {
                // treeZones.splice(treeIndex, 1); // Remove the tree
                treeZones[treeIndex].faint()
              }

              console.log(treeZones)

              // Hide the dialogue box
              document.querySelector('#characterDialogueBox').style.display = 'none';

              // Reset player interaction
              player.isInteracting = false;
              // player.interactionAsset = null;

              console.log('Tree deleted!');
            }
          });
          break
        }

    }
    return
  }

  switch (e.key) {
    case ' ':
      if (!player.interactionAsset) return
      if (player.interactionAsset.type === 'House') {
        const firstMessage = player.interactionAsset.dialogue[0]
        document.querySelector('#houseDialogueBox').innerHTML = firstMessage
        document.querySelector('#houseDialogueBox').style.display = 'flex'
        player.isInteracting = true
        break
      } else {
        // const firstMessage = player.interactionAsset.dialogue[0]
        document.querySelector('#characterDialogueBox').innerHTML = 'Tree'
        document.querySelector('#characterDialogueBox').style.display = 'flex'
        player.isInteracting = true
        break
      }
    // beginning the conversation

    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break

    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})

let clicked = false
addEventListener('click', () => {
  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
})
