document.addEventListener('DOMContentLoaded', () => {
    const homeButton = document.getElementById('homeButton');
    const crownButton = document.getElementById('crownButton');
    const poolsButton = document.getElementById('poolsButton');
    const connectWalletButton = document.getElementById('connectWalletButton');
    const poolsContainer = document.getElementById('poolsContainer');

    let isConnected = false;

    homeButton.addEventListener('click', () => scrollToSection('hero'));
    crownButton.addEventListener('click', () => scrollToSection('king'));
    poolsButton.addEventListener('click', () => scrollToSection('pools'));
    connectWalletButton.addEventListener('click', toggleWalletConnection);

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function toggleWalletConnection() {
        if (isConnected) {
            disconnectWallet();
        } else {
            connectWallet();
        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    isConnected = true;
                    connectWalletButton.textContent = '🔓';
                    alert(`Connected to wallet: ${accounts[0]}`);
                }
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                alert('Failed to connect wallet. Please try again.');
            }
        } else {
            alert('Please install MetaMask to connect your wallet.');
        }
    }

    function disconnectWallet() {
        isConnected = false;
        connectWalletButton.textContent = '👛';
        alert('Wallet disconnected');
    }

    // Simulated pool data
    const pools = [
        { id: 1, name: 'Alpha Pool', symbol: 'ALP', chain: 'Ethereum', tokens: ['ETH', 'USDC'] },
        { id: 2, name: 'Beta Yield', symbol: 'BYD', chain: 'Polygon', tokens: ['MATIC', 'USDT'] },
        { id: 3, name: 'Gamma Finance', symbol: 'GFI', chain: 'Arbitrum', tokens: ['ARB', 'DAI'] }
    ];

    function renderPools() {
        poolsContainer.innerHTML = '';
        pools.forEach(pool => {
            const poolCard = document.createElement('div');
            poolCard.className = 'card';
            poolCard.innerHTML = `
                <h3>${pool.name}</h3>
                <p>Symbol: ${pool.symbol}</p>
                <p>Chain: ${pool.chain}</p>
                <p>Tokens: ${pool.tokens.join(', ')}</p>
                <button class="button button-primary">Stake Now</button>
            `;
            poolsContainer.appendChild(poolCard);
        });
    }

    renderPools();
});