// import Token from './abis/Token.json';
let token0Contract;
let token1Contract;

// Function to fetch the Token ABI from the JSON file
async function loadTokenAbi() {
  try {
    const response = await fetch('abis/Token.json'); // Relative path to the JSON file
    if (!response.ok) {
      throw new Error(`Failed to load Token.json: ${response.statusText}`);
    }
    return await response.json(); // Return the parsed JSON content
  } catch (error) {
    console.error('Error loading Token.json:', error);
    alert('Failed to load Token ABI');
    throw error; // Re-throw to halt execution if needed
  }
}

async function loadCSAMMAbi() {
  try {
    const response = await fetch('abis/CSAMM.json'); // Relative path to the JSON file
    if (!response.ok) {
      throw new Error(`Failed to load Token.json: ${response.statusText}`);
    }
    return await response.json(); // Return the parsed JSON content
  } catch (error) {
    console.error('Error loading Token.json:', error);
    alert('Failed to load Token ABI');
    throw error; // Re-throw to halt execution if needed
  }
}

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// let pools = [];
let loading = false;
let error = null;
let treeVal = 0;
let treeNumber = 0;

let pools = [
  ['0xb1ba9DB205BA7162E46d4330091E8c2F40A65750', '0x5509CDD163d1aFE5Ec9D76876E2e8D05C959A850', '0xcE9210f785bb8cF106C8fbda90037B68d96610c2'],
  ['0x9C73505a4CD7FADB38894BB2de2B5B9D3434531D', '0x60CAc3ad6be26ab6C9404ac848249AAa757bB39e', '0xc163e1CF682FDD9DfD9b17B60B3Bfd3aebD8eDAc'],
  ['0x18b7570a2e89A50a266A0fEB36B0A4bC94BB4b85', '0x362b8C5de425b3FB31304EFbafaEF750c4E3489b', '0xE643Ee9825a2e6D263ac9812551928f393eC44c7']
]

// import Web3 from 'web3'
// Contract addresses and ABI configurations
const NETWORK_ID = '11155111' // Sepolia testnet
let CSAMM_CONTRACT_ADDRESS = pools[treeVal][0]
let TOKEN0_CONTRACT_ADDRESS = pools[treeVal][1]
let TOKEN1_CONTRACT_ADDRESS = pools[treeVal][2]

// console.log(CSAMM_CONTRACT_ADDRESS, TOKEN0_CONTRACT_ADDRESS, TOKEN1_CONTRACT_ADDRESS)

let web3
let account
// let token0Contract
// let token1Contract
let csammContract

// Modal functionality
const modal = document.getElementById('liquidityModal')

function showModal() {
  modal.classList.remove('hidden')
  modal.classList.add('flex')
}

function closeModal() {
  modal.classList.add('hidden')
  modal.classList.remove('flex')
}

function showLoader() {
  const loaderDiv = document.getElementById('loader'); // Ensure this is a simple text container like a span or div.

  loaderDiv.style.display = 'flex'; // Show the loader
  loaderDiv.textContent = ''; // Clear previous text (if any)

  let dotCount = 0;

  // Create the animation
  setInterval(() => {
    dotCount = (dotCount + 1) % 4; // Cycle between 0, 1, 2, 3
    loaderDiv.textContent = 'Loading' + '.'.repeat(dotCount); // Update text content
  }, 500); // Adjust speed as needed (500ms for each update)
}


function hideLoader() {
  const loaderDiv = document.getElementById('loader');
  // const contentDiv = document.getElementById('modalContent');

  loaderDiv.style.display = 'none'; // Hide the loader
  // contentDiv.style.display = 'block'; // Show the content
}

// Web3 functionality
async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert('Please install MetaMask')
      return
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    web3 = new Web3(window.ethereum)
    account = accounts[0]
    const Token = await loadTokenAbi();
    const CSAMMContract = await loadCSAMMAbi();

    // Initialize contracts
    token0Contract = new web3.eth.Contract(Token.abi, TOKEN0_CONTRACT_ADDRESS)
    token1Contract = new web3.eth.Contract(Token.abi, TOKEN1_CONTRACT_ADDRESS)
    csammContract = new web3.eth.Contract(
      CSAMMContract.abi,
      CSAMM_CONTRACT_ADDRESS
    )

    await Promise.all([
      fetchTokenDetails(),
      refreshBalances(),
      fetchVaultInfo()
    ])
  } catch (error) {
    console.error('Wallet connection failed:', error)
    alert('Failed to connect wallet: ' + error.message)
  }
}
async function explorePool() {
  showModal()
  showLoader()
  await connectWallet()
  hideLoader()
}

async function fetchTokenDetails() {
  try {
    // Fetch Token 0 details
    const name0 = await token0Contract.methods.name().call()
    const symbol0 = await token0Contract.methods.symbol().call()
    const url0 = await token0Contract.methods.tokenImageUrl().call()

    document.getElementById('token0Name').textContent = name0
    document.getElementById('token0Symbol').textContent = symbol0
    document.getElementById('token0Image').style.backgroundImage = `url(${url0})`

    // Fetch Token 1 details
    const name1 = await token1Contract.methods.name().call()
    const symbol1 = await token1Contract.methods.symbol().call()
    const url1 = await token1Contract.methods.tokenImageUrl().call()
    document.getElementById('token1Name').textContent = name1
    document.getElementById('token1Symbol').textContent = symbol1
    document.getElementById('token1Image').style.backgroundImage = `url(${url1})`
  } catch (error) {
    console.error('Error fetching token details:', error)
  }
}

async function refreshBalances() {
  try {
    const balance0 = await token0Contract.methods.balanceOf(account).call()
    const balance1 = await token1Contract.methods.balanceOf(account).call()

    console.log(balance0, balance1)

    document.getElementById(
      'token0Balance'
    ).textContent = `Balance: ${web3.utils.fromWei(balance0, 'ether')}`
    document.getElementById(
      'token1Balance'
    ).textContent = `Balance: ${web3.utils.fromWei(balance1, 'ether')}`
  } catch (error) {
    console.error('Error refreshing balances:', error)
  }
}

async function fetchVaultInfo() {
  try {
    const totalLiquidity = await csammContract.methods.totalSupply().call()
    const userShares = await csammContract.methods.balanceOf(account).call()
    const initialLiquidity = await csammContract.methods
      .initialLiquidity(account)
      .call()
    const roi = await csammContract.methods.calculateROI(account).call()

    document.getElementById(
      'totalLiquidity'
    ).textContent = `${web3.utils.fromWei(totalLiquidity, 'ether')} Shares`
    document.getElementById(
      'liquidityShares'
    ).textContent = `Your Liquidity Shares: ${web3.utils.fromWei(
      userShares,
      'ether'
    )}`
    document.getElementById('initialLiquidity').textContent =
      web3.utils.fromWei(initialLiquidity, 'ether')
    document.getElementById('roi').textContent = `${roi}%`
  } catch (error) {
    console.error('Error fetching vault info:', error)
  }
}

async function approveToken0() {
  try {
    const amount0 = document.getElementById('amount0Input').value

    if (!amount0) {
      alert('Please enter amounts for token 0')
      return
    }

    const amount0Wei = web3.utils.toWei(amount0, 'ether')

    await token0Contract.methods
      .approve(CSAMM_CONTRACT_ADDRESS, amount0Wei)
      .send({ from: account })

    alert('Tokens approved successfully!')
  } catch (error) {
    console.error('Approval failed:', error)
    alert('Failed to approve tokens: ' + error.message)
  }
}

async function approveToken1() {
  try {
    const amount1 = document.getElementById('amount1Input').value

    if (!amount1) {
      alert('Please enter amounts for token 1')
      return
    }

    const amount1Wei = web3.utils.toWei(amount1, 'ether')

    await token1Contract.methods
      .approve(CSAMM_CONTRACT_ADDRESS, amount1Wei)
      .send({ from: account })

    alert('Tokens approved successfully!')
  } catch (error) {
    console.error('Approval failed:', error)
    alert('Failed to approve tokens: ' + error.message)
  }
}

async function addLiquidity() {
  try {
    const amount0 = document.getElementById('amount0Input').value
    const amount1 = document.getElementById('amount1Input').value

    if (!amount0 || !amount1) {
      alert('Please enter amounts for both tokens')
      return
    }

    const amount0Wei = web3.utils.toWei(amount0, 'ether')
    const amount1Wei = web3.utils.toWei(amount1, 'ether')

    await csammContract.methods
      .addLiquidity(amount0Wei, amount1Wei)
      .send({ from: account })

    await Promise.all([refreshBalances(), fetchVaultInfo()])

    alert('Liquidity added successfully!')
    document.getElementById('amount0Input').value = ''
    document.getElementById('amount1Input').value = ''
  } catch (error) {
    console.error('Add liquidity failed:', error)
    alert('Failed to add liquidity: ' + error.message)
  }
}

async function removeLiquidity() {
  try {
    const sharesToRemove = document.getElementById(
      'sharesToRemoveInput'
    ).value

    if (!sharesToRemove || parseFloat(sharesToRemove) <= 0) {
      alert('Please enter a valid number of shares to remove')
      return
    }

    const sharesToRemoveWei = web3.utils.toWei(sharesToRemove, 'ether')

    await csammContract.methods
      .removeLiquidity(sharesToRemoveWei)
      .send({ from: account })

    await Promise.all([refreshBalances(), fetchVaultInfo()])

    alert('Liquidity removed successfully!')
    document.getElementById('sharesToRemoveInput').value = ''
  } catch (error) {
    console.error('Remove liquidity failed:', error)
    alert('Failed to remove liquidity: ' + error.message)
  }
}

// Event listeners for window.ethereum
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length > 0) {
      connectWallet()
    }
  })

  window.ethereum.on('chainChanged', () => {
    window.location.reload()
  })
}

// function explorePool(index) {
//   // Redirect to a different page, passing the pool ID or name as a query parameter
//   const pool = pools[index];
//   if (pool) {
//     window.location.href = `explore.html?poolId=${pool.id}&name=${encodeURIComponent(pool.name)}`;
//   }
// }

// function cancelAction() {
//   // Logic for cancel button (e.g., close the dialogue box or reset UI)
//   document.querySelector('#characterDialogueBox').innerHTML = '';
// }

// async function fetchPools() {
//   loading = true;
//   error = null;

//   try {
//     const response = await fetch('http://localhost:3000/api/user/fetch/pools');
//     console.log(response);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch pools: ${response.statusText}`);
//     }
//     const data = await response.json();

//     console.log(data);

//     pools = data.map((pool) => ({
//       id: pool.id,
//       name: pool.name,
//       symbol: pool.symbol,
//       chain: pool.chain,
//       poolTokens: pool.poolTokens.map((token) => ({
//         symbol: token.symbol,
//         name: token.name,
//         balanceUSD: token.balanceUSD,
//       })),
//     }));

//     console.log("Pools fetched successfully:", pools);
//     treeNumber = pools.length;
//     console.log("Tree number:", treeNumber);

//     // Call the function to set up and start the game
//     setupAndStartGame();

//   } catch (err) {
//     console.error("Error fetching pools:", err);
//     error = err.message || "An error occurred while fetching pools.";
//   } finally {
//     loading = false;
//   }
// }



function fetchPools() {
  // pools = [
  //   '0xb1ba9DB205BA7162E46d4330091E8c2F40A65750',
  //   '0x9C73505a4CD7FADB38894BB2de2B5B9D3434531D',
  //   '0x18b7570a2e89A50a266A0fEB36B0A4bC94BB4b85'
  // ]

  treeNumber = pools.length

  setupAndStartGame()
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  fetchPools();
});


function setupAndStartGame() {
  // All the code that was previously after the DOMContentLoaded event listener goes here
  const collisionsMap = [];
  for (let i = 0; i < collisions.length; i += 150) {
    collisionsMap.push(collisions.slice(i, 150 + i));
  }

  const houseMap = [];
  for (let i = 0; i < houses.length; i += 150) {
    houseMap.push(houses.slice(i, 150 + i));
  }

  console.log(treeNumber);
  const treeMap = [];
  for (let i = 0; i < trees.length; i += 150) {
    treeMap.push(trees.slice(i, 150 + i));
  }
  console.log(treeMap);

  const boundaries = [];
  const offset = {
    x: -900,
    y: -700
  };

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
        );
    });
  });

  const housesMap = [];
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
        );
    });
  });

  const tree1Image = new Image();
  tree1Image.src = './img/tree1.png';

  const tree2Image = new Image();
  tree2Image.src = './img/tree2.png';

  const tree3Image = new Image();
  tree3Image.src = './img/tree3.png';

  const treeZones = [];
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
        );

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
        );
    });
  });

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
  console.log(treeZones);

  const image = new Image();
  image.src = './img/GameMapFinal.png';

  const playerDownImage = new Image();
  playerDownImage.src = './img/playerDown.png';

  const playerUpImage = new Image();
  playerUpImage.src = './img/playerUp.png';

  const playerLeftImage = new Image();
  playerLeftImage.src = './img/playerLeft.png';

  const playerRightImage = new Image();
  playerRightImage.src = './img/playerRight.png';

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
  });

  const background = new Sprite({
    position: {
      x: offset.x,
      y: offset.y
    },
    image: image
  });

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
  };

  const movables = [
    background,
    ...boundaries,
    ...housesMap,
    ...treeZones
  ];
  const renderables = [
    background,
    ...boundaries,
    ...housesMap,
    player,
    ...treeZones
  ];

  function animate() {
    const animationId = window.requestAnimationFrame(animate);
    renderables.forEach((renderable) => {
      renderable.draw();
    });

    const directionsDiv = document.getElementById('directions');

    if (player.interactionAsset === null) {
      // Make it visible and animate popping in
      gsap.fromTo(
        directionsDiv,
        { y: '100%', opacity: 0 }, // Starting position: bottom and invisible
        {
          y: '0%', opacity: 1, duration: 1, ease: 'power2.out', // Ensure the div is visible during the animation

        }
      );
    } else {
      // Animate popping out and then hide it
      gsap.fromTo(
        directionsDiv,
        { y: '0%', opacity: 1 }, // Current visible position
        {
          y: '100%', opacity: 0, duration: 1, ease: 'power2.out'
        }
      );
    }


    let moving = true;
    player.animate = false;

    if (keys.w.pressed && lastKey === 'w') {
      player.animate = true;
      player.image = player.sprites.up;

      checkForHouseCollision({
        housesMap,
        player,
        characterOffset: { x: 0, y: 3 }
      });

      if (player.interactionAsset === null) {
        treeVal = checkForTreeCollision({
          treeZones,
          player,
          characterOffset: { x: 0, y: 3 }
        });
      }

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
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
          moving = false;
          break;
        }
      }

      if (moving)
        movables.forEach((movable) => {
          movable.position.y += 3;
        });
    } else if (keys.a.pressed && lastKey === 'a') {
      player.animate = true;
      player.image = player.sprites.left;

      checkForHouseCollision({
        housesMap,
        player,
        characterOffset: { x: 3, y: 0 }
      });

      if (player.interactionAsset === null) {
        treeVal = checkForTreeCollision({
          treeZones,
          player,
          characterOffset: { x: 3, y: 0 },
          treeVal
        });
      }

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
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
          moving = false;
          break;
        }
      }

      if (moving)
        movables.forEach((movable) => {
          movable.position.x += 3;
        });
    } else if (keys.s.pressed && lastKey === 's') {
      player.animate = true;
      player.image = player.sprites.down;

      checkForHouseCollision({
        housesMap,
        player,
        characterOffset: { x: 0, y: -3 }
      });

      if (player.interactionAsset === null) {
        treeVal = checkForTreeCollision({
          treeZones,
          player,
          characterOffset: { x: 0, y: -3 },
          treeVal
        });
      }

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
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
          moving = false;
          break;
        }
      }

      if (moving)
        movables.forEach((movable) => {
          movable.position.y -= 3;
        });
    } else if (keys.d.pressed && lastKey === 'd') {
      player.animate = true;
      player.image = player.sprites.right;

      checkForHouseCollision({
        housesMap,
        player,
        characterOffset: { x: -3, y: 0 }
      });

      if (player.interactionAsset === null) {
        treeVal = checkForTreeCollision({
          treeZones,
          player,
          characterOffset: { x: -3, y: 0 },
          treeVal
        });
      }

      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
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
          moving = false;
          break;
        }
      }

      if (moving)
        movables.forEach((movable) => {
          movable.position.x -= 3;
        });
    }
  }

  let lastKey = '';

  window.addEventListener('keydown', (e) => {
    if (player.isInteracting) {
      switch (e.key) {
        case 'Escape':
          if (player.interactionAsset.type === 'House') {
            player.isInteracting = false;
            player.interactionAsset.dialogueIndex = 0;
            document.querySelector('#houseDialogueBox').style.display = 'none';
          } else {
            player.isInteracting = false;
            player.interactionAsset.dialogueIndex = 0;
            document.querySelector('#characterDialogueBox').style.display = 'none';
          }
          break;
      }
      return;
    }

    switch (e.key) {
      case ' ':
        if (!player.interactionAsset) return;
        if (player.interactionAsset.type === 'House') {
          const firstMessage = player.interactionAsset.dialogue[0];
          document.querySelector('#houseDialogueBox').innerHTML = firstMessage;
          document.querySelector('#houseDialogueBox').style.display = 'flex';
          player.isInteracting = true;
        } else {
          console.log(treeVal)
          CSAMM_CONTRACT_ADDRESS = pools[treeVal][0]
          TOKEN0_CONTRACT_ADDRESS = pools[treeVal][1]
          TOKEN1_CONTRACT_ADDRESS = pools[treeVal][2]

          // console.log(CSAMM_CONTRACT_ADDRESS, TOKEN0_CONTRACT_ADDRESS, TOKEN1_CONTRACT_ADDRESS)

          //   document.querySelector('#characterDialogueBox').innerHTML = `
          //   <div>
          //   <h3>${pools[treeVal].name} (${pools[treeVal].symbol})</h3>
          //   <p>Chain: ${pools[treeVal].chain}</p>
          //   <ul>
          //     ${pools[treeVal].poolTokens
          //       .map(
          //         (token) => `
          //       <li>
          //         ${token.name} (${token.symbol}): $${token.balanceUSD}
          //       </li>
          //     `
          //       )
          //       .join('')}
          //   </ul>

          //   <div class="w-full flex justify-between ">
          // <button class="px-4 py-1 border"  id="explore" onclick="explorePool()">Explore</button>
          // <button class="px-4 py-1 border" onclick="cancelAction()">Cancel</button>
          //   </div>

          // </div>`

          document.querySelector('#characterDialogueBox').innerHTML = `
          <div class="w-full space-y-4">
          <h3>${pools[treeVal][0]}</h3>


          <div class="w-full flex justify-between ">
            <button class="p-4 py-2 bg-emerald-600 border hover:bg-emerald-700"  id="explore" onclick="explorePool()">Explore</button>
<button class="p-4 py-2 bg-rose-600 border hover:bg-rose-700">
  Cancel <span class="text-sm text-gray-300">[Esc]</span>
</button>          </div>
        </div>`
          document.querySelector('#characterDialogueBox').style.display = 'flex';
          player.isInteracting = true;
        }
        break;
      case 'w':
      case 'a':
      case 's':
      case 'd':
        keys[e.key].pressed = true;
        lastKey = e.key;
        break;
    }
  });

  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'w':
      case 'a':
      case 's':
      case 'd':
        keys[e.key].pressed = false;
        break;
    }
  });

  let clicked = false;
  addEventListener('click', () => {
    if (!clicked) {
      audio.Map.play();
      clicked = true;
    }
  });

  // Start the game loop
  animate();
}

// Log that the script has loaded
console.log("Script loaded");
// fetchPools()
// setupAndStartGame()