// import Token from './abis/Token.json';
let token0Contract
let token1Contract

const GEMINI_API_KEY = "AIzaSyADMHAZxAppXgeULpY-6G7FqD4pWYNIHQY";

// Function to fetch the Token ABI from the JSON file
async function loadTokenAbi() {
  try {
    const response = await fetch('abis/Token.json') // Relative path to the JSON file
    if (!response.ok) {
      throw new Error(`Failed to load Token.json: ${response.statusText}`)
    }
    return await response.json() // Return the parsed JSON content
  } catch (error) {
    console.error('Error loading Token.json:', error)
    alert('Failed to load Token ABI')
    throw error // Re-throw to halt execution if needed
  }
}

async function loadCSAMMAbi() {
  try {
    const response = await fetch('abis/CSAMM.json') // Relative path to the JSON file
    if (!response.ok) {
      throw new Error(`Failed to load Token.json: ${response.statusText}`)
    }
    return await response.json() // Return the parsed JSON content
  } catch (error) {
    console.error('Error loading Token.json:', error)
    alert('Failed to load Token ABI')
    throw error // Re-throw to halt execution if needed
  }
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// let pools = [];
let loading = false
let error = null
let treeVal = 0
let houseVal = 0
let treeNumber = 0

let pools = [
  [
    '0xb1ba9DB205BA7162E46d4330091E8c2F40A65750',
    '0x5509CDD163d1aFE5Ec9D76876E2e8D05C959A850',
    '0xcE9210f785bb8cF106C8fbda90037B68d96610c2'
  ],
  [
    '0x9C73505a4CD7FADB38894BB2de2B5B9D3434531D',
    '0x60CAc3ad6be26ab6C9404ac848249AAa757bB39e',
    '0xc163e1CF682FDD9DfD9b17B60B3Bfd3aebD8eDAc'
  ],
  [
    '0x18b7570a2e89A50a266A0fEB36B0A4bC94BB4b85',
    '0x362b8C5de425b3FB31304EFbafaEF750c4E3489b',
    '0xE643Ee9825a2e6D263ac9812551928f393eC44c7'
  ],
  [
    '0x80cc173361C8Ee7d47FF37785c45ef8E35cd24C2',
    '0x3D4855431E12B8B6Ed614064E8d32F6408180297',
    '0x4262FCf98F0b83dE34A3304C17064A088176694F'
  ],
  [
    '0x557183149Ed6bF1C301F5D5Fb5C99f052e3FB59d',
    '0x3D4855431E12B8B6Ed614064E8d32F6408180297',
    '0x5509CDD163d1aFE5Ec9D76876E2e8D05C959A850'
  ],
  [
    '0x13c58CD917B241Cc837bbCb290a7b221b3430Af0',
    '0xcE9210f785bb8cF106C8fbda90037B68d96610c2',
    '0xE643Ee9825a2e6D263ac9812551928f393eC44c7'
  ],
  [
    '0xf4bd0831C684d39890da3A65213BD1a1eAa19B8e',
    '0xcE9210f785bb8cF106C8fbda90037B68d96610c2',
    '0x3D4855431E12B8B6Ed614064E8d32F6408180297'
  ],
  [
    '0xCCC15AFC154AF4D0fc53AB5e29FF569E8A299Abc',
    '0x5509CDD163d1aFE5Ec9D76876E2e8D05C959A850',
    '0x3D4855431E12B8B6Ed614064E8d32F6408180297'
  ],
  [
    '0xC7fB7222678c73F58F2755E9B74721Ccd8Bc3767',
    '0x5509CDD163d1aFE5Ec9D76876E2e8D05C959A850',
    '0x60CAc3ad6be26ab6C9404ac848249AAa757bB39e'
  ],
  [
    '0x55a3D0bB216c8b08750E777474d9b7787AC85347',
    '0xcE9210f785bb8cF106C8fbda90037B68d96610c2',
    '0x60CAc3ad6be26ab6C9404ac848249AAa757bB39e'
  ],
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
  const loaderDiv = document.getElementById('loader') // Ensure this is a simple text container like a span or div.

  loaderDiv.style.display = 'flex' // Show the loader
  loaderDiv.textContent = '' // Clear previous text (if any)

  let dotCount = 0

  // Create the animation
  setInterval(() => {
    dotCount = (dotCount + 1) % 4 // Cycle between 0, 1, 2, 3
    loaderDiv.textContent = 'Loading' + '.'.repeat(dotCount) // Update text content
  }, 500) // Adjust speed as needed (500ms for each update)
}

function hideLoader() {
  const loaderDiv = document.getElementById('loader')
  // const contentDiv = document.getElementById('modalContent');

  loaderDiv.style.display = 'none' // Hide the loader
  // contentDiv.style.display = 'block'; // Show the content
}

async function handleWalletConnection() {
  try {
    const connectButton = document.getElementById('connectButton')
    const walletInfo = document.getElementById('walletInfo')
    const walletAddressDisplay = document.getElementById('walletAddress')

    // Check if MetaMask is installed
    if (!window.ethereum) {
      alert(
        'MetaMask is not installed. Please install MetaMask to use this feature.'
      )
      return
    }

    if (connectButton.innerText === 'Connect') {
      // Connect to MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      account = accounts[0]

      // Initialize Web3
      web3 = new Web3(window.ethereum)

      // Update UI to show connected state
      connectButton.innerText = 'Disconnect'
      walletInfo.classList.remove('hidden')
      walletAddressDisplay.textContent = `${account.slice(
        0,
        6
      )}...${account.slice(-4)}`
    } else {
      // Disconnect wallet
      account = null
      connectButton.innerText = 'Connect'
      walletInfo.classList.add('hidden')
      walletAddressDisplay.textContent = ''
    }
  } catch (error) {
    console.error('Error handling wallet connection:', error)
    alert('An error occurred while connecting to the wallet.')
  }
}

// Check if the wallet is already connected on page load
async function checkWalletConnection() {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length > 0) {
      // Wallet is already connected
      account = accounts[0]
      web3 = new Web3(window.ethereum)

      // Update UI to show connected state
      document.getElementById('connectButton').classList.add('hidden')
      const walletInfo = document.getElementById('walletInfo')
      walletInfo.classList.remove('hidden')
      document.getElementById('walletAddress').textContent = `${account.slice(
        0,
        6
      )}...${account.slice(-4)}`
    }
  }
}

window.addEventListener('DOMContentLoaded', checkWalletConnection)

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
    const Token = await loadTokenAbi()
    const CSAMMContract = await loadCSAMMAbi()

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
      fetchVaultInfo(),
      // fetchAllInvestments(CSAMMContract)
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
    document.getElementById(
      'token0Image'
    ).style.backgroundImage = `url(${url0})`

    // Fetch Token 1 details
    const name1 = await token1Contract.methods.name().call()
    const symbol1 = await token1Contract.methods.symbol().call()
    const url1 = await token1Contract.methods.tokenImageUrl().call()
    document.getElementById('token1Name').textContent = name1
    document.getElementById('token1Symbol').textContent = symbol1
    document.getElementById(
      'token1Image'
    ).style.backgroundImage = `url(${url1})`
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

async function getCSAMM(csammContract) {
  try {
    const totalLiquidity = await csammContract.methods.totalSupply().call();
    const userShares = await csammContract.methods.balanceOf(account).call();
    const initialLiquidity = await csammContract.methods.initialLiquidity(account).call();
    const roi = await csammContract.methods.calculateROI(account).call();

    return { totalLiquidity, userShares, initialLiquidity, roi };
  } catch (error) {
    console.error('Error fetching vault info:', error);
    return null; // Handle error gracefully by returning null
  }
}

async function fetchAllInvestments() {
  try {
    web3 = new Web3(window.ethereum)
    const CSAMMContract = await loadCSAMMAbi()

    const list = await Promise.all(
      pools.map(async (vault) => {
        // console.log(vault[0])
        const CC = new web3.eth.Contract(CSAMMContract.abi, vault[0]);

        const csammData = await getCSAMM(CC);
        if (csammData) {
          // console.log(csammData)
          return {
            totalLiquidity: csammData.totalLiquidity.toString(),
            userShares: csammData.userShares.toString(),
            initialLiquidity: csammData.initialLiquidity.toString(),
            roi: csammData.roi.toString(),
          };
        }
        return null; // Skip if fetching data failed
      })
    );

    // Filter out any null values (failed fetches)
    const filteredList = list.filter((item) => item !== null);

    console.log(filteredList);
    return filteredList;
  } catch (error) {
    console.error('Error fetching all investments:', error);
  }
}

fetchAllInvestments()



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
    const sharesToRemove = document.getElementById('sharesToRemoveInput').value

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

async function getTokensDetail(add) {
  try {
    const CSM = await loadCSAMMAbi()
    const vault = new web3.eth.Contract(CSM.abi, add)
    const Token = await loadTokenAbi() // Load the token ABI

    const tokenA = await vault.methods.token0().call()
    const tokenB = await vault.methods.token1().call()

    const tokenContract = new web3.eth.Contract(Token.abi, tokenA)
    const name = await tokenContract.methods.name().call();
    const url = await tokenContract.methods.tokenImageUrl().call();

    const tokenContract1 = new web3.eth.Contract(Token.abi, tokenB)
    const name1 = await tokenContract1.methods.name().call();
    const url1 = await tokenContract1.methods.tokenImageUrl().call();

    return {
      name, name1, url, url1
    }

  } catch (error) {
    console.error("Error get data", error.message);
  }
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

async function generateContentWithGemini(prompt) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error("Failed to fetch from Gemini API");
    }

    const data = await response.json();
    return data || "No response from Gemini API";
  } catch (error) {
    console.error("Error generating content:", error.message);
    return "Error occurred during content generation";
  }
}


async function processInvestmentsAndGenerateInsights() {
  try {
    // Fetch investment data
    const investments = await fetchAllInvestments();

    if (!investments || investments.length === 0) {
      console.log("No investment data available.");
      return;
    }

    // Refined prompt
    const prompt = `
      You are an AI assistant designed to provide actionable insights and trends for players engaging with an application. 
      The application context is as follows: 
      "Discover high ROI pools in the ETH ecosystem (across L2s or a particular chain) using AI. 
      The application works like a game where assets (linked to vaults) dynamically appear in a game garden based on their visibility index. 
      The height of a tree or size of an asset correlates with the visibility index, and assets below a certain visibility index threshold are removed. 

      Your task is to analyze the following data and extract meaningful insights and trends for players. Provide actionable suggestions to help them optimize their gameplay strategy." 

      Data: ${JSON.stringify(investments)}

      Output actionable insights and suggestions in bullet points.
      Summarize your answer by highlighting the important points in 50-60 words.

      make it so that I get the response in HTML format, so that i can set dangerouslySetInnerHTML for response.
      `;

    console.log(prompt)

    // Generate content using Gemini API
    const insights = await generateContentWithGemini(prompt);

    console.log("Generated Insights and Suggestions:");
    console.log(insights);
    return insights
  } catch (error) {
    console.error("Error processing investments or generating insights:", error.message);
  }
}


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
  console.log('DOM fully loaded and parsed')
  fetchPools()

  getAggregatorPools('POLYGON').then((pools) => {
    console.log(pools);
  });
})



function setupAndStartGame() {
  // All the code that was previously after the DOMContentLoaded event listener goes here
  const collisionsMap = []
  for (let i = 0; i < collisions.length; i += 150) {
    collisionsMap.push(collisions.slice(i, 150 + i))
  }

  const houseMap = []
  for (let i = 0; i < houses.length; i += 150) {
    houseMap.push(houses.slice(i, 150 + i))
  }

  console.log(treeNumber)
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
  tree1Image.src =
    'https://aggregator.walrus-testnet.walrus.space/v1/L44d84wxVCelypd1nS4MjPGm2SddvhNLZ03-0SeJNhs'

  const tree2Image = new Image()
  tree2Image.src =
    'https://aggregator.walrus-testnet.walrus.space/v1/7R6ynIQw4Va3beydbU-KkDgtWpgfWU1BsCxllrSIRWU'

  const tree3Image = new Image()
  tree3Image.src =
    'https://aggregator.walrus-testnet.walrus.space/v1/fivcM3vYW8xFFuda9uBClU_SRNG8N1o5ZvCaE2UUxpg'

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

  // console.log(treeZones)



  function getRandomTreeZones(treeZones, treeNumber) {
    const filteredZones = treeZones.filter(zone => (zone.position.x > 300 && zone.position.x < 1200 && zone.position.y < 1000)); // Filter tree zones with x < 400
    const selectedZones = [];
    const usedIndices = new Set();

    while (
      selectedZones.length < treeNumber &&
      usedIndices.size < filteredZones.length
    ) {
      const randomIndex = Math.floor(Math.random() * filteredZones.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selectedZones.push(filteredZones[randomIndex]);
      }
    }

    return selectedZones;
  }

  const newTreeZones = getRandomTreeZones(treeZones, treeNumber)
  treeZones.length = 0 // Clear original treeZones
  treeZones.push(...newTreeZones)
  console.log(treeZones)

  const image = new Image()
  image.src =
    'https://aggregator.walrus-testnet.walrus.space/v1/IVV2-TgQohZoNBs0rXx596wCo45356IEVS2eb3JNUKU'

  const playerDownImage = new Image()
  playerDownImage.src =
    'https://aggregator.walrus-testnet.walrus.space/v1/ToX9bwgPq4MqKr7w_3dT8PZIKdcsJhpeG2qNW5ARWOE'

  const playerUpImage = new Image()
  playerUpImage.src =
    'https://aggregator.walrus-testnet.walrus.space/v1/cIAXDfy117Qe1UA1jcTNAz2ZlD7YfKwqtboUAVN6700'

  const playerLeftImage = new Image()
  playerLeftImage.src =
    'https://aggregator.walrus-testnet.walrus.space/v1/FVYt9T7wBJR9BNTjt0O2UkIeeMuR9V7lut9-O7hw5_k'

  const playerRightImage = new Image()
  playerRightImage.src =
    'https://aggregator.walrus-testnet.walrus.space/v1/yKa29JOw9HjmyazBx7JMeO0fg9C2NzBjBO_zc-ATnwY'

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

  const movables = [background, ...boundaries, ...housesMap, ...treeZones]
  const renderables = [
    background,
    ...boundaries,
    ...housesMap,
    player,
    ...treeZones
  ]

  function animate() {
    const animationId = window.requestAnimationFrame(animate)
    renderables.forEach((renderable) => {
      renderable.draw()
    })

    const directionsDiv = document.getElementById('directions')

    if (player.interactionAsset === null) {
      // Make it visible and animate popping in
      gsap.fromTo(
        directionsDiv,
        { y: '100%', opacity: 0 }, // Starting position: bottom and invisible
        {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: 'power2.out' // Ensure the div is visible during the animation
        }
      )
    } else {
      // Animate popping out and then hide it
      gsap.fromTo(
        directionsDiv,
        { y: '0%', opacity: 1 }, // Current visible position
        {
          y: '100%',
          opacity: 0,
          duration: 1,
          ease: 'power2.out'
        }
      )
    }

    let moving = true
    player.animate = false

    if (keys.w.pressed && lastKey === 'w') {
      player.animate = true
      player.image = player.sprites.up

      houseVal = checkForHouseCollision({
        housesMap,
        player,
        characterOffset: { x: 0, y: 3 }
      })

      if (player.interactionAsset === null) {
        treeVal = checkForTreeCollision({
          treeZones,
          player,
          characterOffset: { x: 0, y: 3 }
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

      houseVal = checkForHouseCollision({
        housesMap,
        player,
        characterOffset: { x: 3, y: 0 }
      })

      if (player.interactionAsset === null) {
        treeVal = checkForTreeCollision({
          treeZones,
          player,
          characterOffset: { x: 3, y: 0 },
          treeVal
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

      houseVal = checkForHouseCollision({
        housesMap,
        player,
        characterOffset: { x: 0, y: -3 }
      })

      if (player.interactionAsset === null) {
        treeVal = checkForTreeCollision({
          treeZones,
          player,
          characterOffset: { x: 0, y: -3 },
          treeVal
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

      houseVal = checkForHouseCollision({
        housesMap,
        player,
        characterOffset: { x: -3, y: 0 }
      })

      if (player.interactionAsset === null) {
        treeVal = checkForTreeCollision({
          treeZones,
          player,
          characterOffset: { x: -3, y: 0 },
          treeVal
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

  let lastKey = ''

  window.addEventListener('keydown', (e) => {
    if (player.isInteracting) {
      switch (e.key) {
        case 'Escape':
          if (player.interactionAsset.type === 'House') {
            player.isInteracting = false
            player.interactionAsset.dialogueIndex = 0
            document.querySelector('#houseDialogueBox').style.display = 'none'
          } else {
            player.isInteracting = false
            player.interactionAsset.dialogueIndex = 0
            document.querySelector('#characterDialogueBox').style.display =
              'none'
          }
          break
      }
      return
    }

    async function getInventoryData() {
      const tokens = [
        '0x5509CDD163d1aFE5Ec9D76876E2e8D05C959A850',
        '0xcE9210f785bb8cF106C8fbda90037B68d96610c2',
        '0x60CAc3ad6be26ab6C9404ac848249AAa757bB39e',
        '0xc163e1CF682FDD9DfD9b17B60B3Bfd3aebD8eDAc',
        '0x362b8C5de425b3FB31304EFbafaEF750c4E3489b',
        '0xE643Ee9825a2e6D263ac9812551928f393eC44c7',
        '0x3D4855431E12B8B6Ed614064E8d32F6408180297',
        '0x4262FCf98F0b83dE34A3304C17064A088176694F'
      ]

      const Token = await loadTokenAbi() // Load the token ABI
      let token_names = []

      for (let tokenAddress of tokens) {
        const tokenContract = new web3.eth.Contract(Token.abi, tokenAddress)

        try {
          const balance = await tokenContract.methods.balanceOf(account).call()
          const balance_in_ethers = web3.utils.fromWei(balance, 'ether')
          const name = await tokenContract.methods.name().call()
          const symbol = await tokenContract.methods.symbol().call()
          const url = await tokenContract.methods.tokenImageUrl().call()

          // Check if balance > 0 and add to the filtered list
          if (balance > 0) {
            token_names.push({
              tokenAddress,
              name,
              balance_in_ethers,
              symbol,
              url
            })
          }
        } catch (error) {
          console.error(
            `Failed to fetch balance for token: ${tokenAddress}`,
            error
          )
        }
      }
      console.log(token_names)
      return token_names // Return the filtered balances
    }

    switch (e.key) {
      case ' ':
        if (!player.interactionAsset) return
        if (player.interactionAsset.type === 'House') {
          console.log(houseVal)
          // Initially show the modal and display loading message


          // Call the async function to fetch inventory data
          if (houseVal < 100) {
            document.querySelector('#houseDialogueBox').innerHTML = `
            <div class="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-auto">
              <div class="text-center text-2xl font-semibold mb-4">Inventory</div>
              <div id="loadingMessage" class="text-center text-gray-300">Loading...</div>
            </div>
          `
            document.querySelector('#houseDialogueBox').style.display = 'flex '
            player.isInteracting = true

            getInventoryData()
              .then((data) => {
                console.log(data) // Log the inventory data for debugging

                // Construct the grid layout HTML for the inventory data
                const inventoryHtml = data.length
                  ? `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      ${data
                    .map(
                      (item) => `
                          <div class="border bg-gray-900 p-4 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
                            <img src="${item.url}" alt="${item.name}" class="w-full h-32 object-cover mb-3 rounded-lg shadow-md">
                            <div class="text-center">
                              <h3 class="text-lg font-semibold text-white truncate">${item.name}</h3>
                              <p class="text-xs text-gray-400 font-mono truncate">${item.tokenAddress}</p>
                              <p class="text-xs text-gray-300 font-mono mt-2">Balance: <span class="text-green-400 font-mono">${item.balance_in_ethers} ${item.symbol}</span></p>
                            </div>
                          </div>
                        `
                    )
                    .join('')}
                    </div>
                  `
                  : '<p class="text-center text-gray-400">No items in inventory.</p>'

                // Update the modal with the fetched inventory data
                document.querySelector('#houseDialogueBox').innerHTML = `
                <div class="bg-gray-800 text-white p-6 rounded-lg shadow-xl h-full w-full overflow-y-auto max-w-4xl mx-auto">
                  <div class="text-center text-2xl font-semibold mb-4">Inventory</div>
                  ${inventoryHtml}
                </div>
              `
              })
              .catch((error) => {
                console.error('Failed to fetch inventory data:', error)

                // In case of an error, display an error message
                document.querySelector('#houseDialogueBox').innerHTML = `
                <div class="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
                  <div class="text-center text-2xl font-semibold mb-4">Inventory</div>
                  <p class="text-center text-gray-400">Error loading inventory data.</p>
                </div>
              `
              })
          } else if (houseVal >= 100 && houseVal < 200) {
            document.querySelector('#houseDialogueBox').innerHTML = `
            <div class="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-auto">
              <div class="text-center text-2xl font-semibold mb-4">AI House</div>
              <div id="loadingMessage" class="text-center text-gray-300">Loading...</div>
            </div>
          `
            document.querySelector('#houseDialogueBox').style.display = 'flex '
            player.isInteracting = true

            processInvestmentsAndGenerateInsights().then((data) => {
              if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                const insightsText = data.candidates[0].content.parts[0].text;

                document.querySelector("#houseDialogueBox").innerHTML = `
                  <div class="bg-gray-800 text-white p-6 rounded-lg shadow-xl h-full w-full overflow-y-auto max-w-4xl mx-auto">
                    <div class="text-center text-2xl font-semibold mb-4">AI House</div>
                    <div dangerouslySetInnerHTML={{__html:${insightsText}}}
                  </div>`;
              } else {
                document.querySelector("#houseDialogueBox").innerHTML = `
                  <div class="bg-red-600 text-white p-6 rounded-lg shadow-xl h-full w-full overflow-y-auto max-w-4xl mx-auto">
                    <div class="text-center text-2xl font-semibold mb-4">Error</div>
                    Failed to generate insights. Please try again later.
                  </div>`;
              }
            });


          }
        } else {
          console.log(treeVal)
          CSAMM_CONTRACT_ADDRESS = pools[treeVal][0]
          TOKEN0_CONTRACT_ADDRESS = pools[treeVal][1]
          TOKEN1_CONTRACT_ADDRESS = pools[treeVal][2]

          getTokensDetail(CSAMM_CONTRACT_ADDRESS)
            .then(({ name, name1, url, url1 }) => {
              document.querySelector('#characterDialogueBox').innerHTML = `
            <div class='space-y-4 w-full'>
              <div class="w-full flex gap-4 items-center">
              <div class="relative w-28 h-16">
                <img src="${url}" alt="${name}" class="absolute top-0 left-0 rounded-full object-cover h-16 w-16 border-2 border-white shadow-md" />
                <img src="${url1}" alt="${name1}" class="absolute top-0 left-8 rounded-full object-cover h-16 w-16 border-2 border-white shadow-md" />
              </div>
                <h3 class="text-lg font-bold">${name} - ${name1}</h3>
              </div>

              <div class="w-full flex justify-between ">
                <button class="p-4 py-2 bg-emerald-600 border hover:bg-emerald-700"  id="explore" onclick="explorePool()">Explore</button>
                <button class="p-4 py-2 bg-rose-600 border hover:bg-rose-700">
                    Cancel <span class="text-sm text-gray-300">[Esc]</span>
                </button>
              </div>
            </div>
          </div>
            `;
            })




          document.querySelector('#characterDialogueBox').style.display = 'flex'
          player.isInteracting = true
        }
        break
      case 'w':
      case 'a':
      case 's':
      case 'd':
        keys[e.key].pressed = true
        lastKey = e.key
        break
    }
  })

  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'w':
      case 'a':
      case 's':
      case 'd':
        keys[e.key].pressed = false
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

  // Start the game loop
  animate()
}

// Log that the script has loaded
console.log('Script loaded')
// fetchPools()
// setupAndStartGame()
