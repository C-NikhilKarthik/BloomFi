let web3;
const connectBtn = document.getElementById('connectBtn');
const walletOptions = document.getElementById('walletOptions');
const walletConnect = document.getElementById('walletConnect');
const walletInfo = document.getElementById('walletInfo');

connectBtn.addEventListener('click', () => {
    walletOptions.classList.toggle('hidden');
});

async function updateWalletUI(walletData) {
    document.getElementById('walletAddress').textContent = shortenAddress(walletData.address);
    document.getElementById('walletBalance').textContent = `${formatBalance(walletData.balance)} ETH`;
    document.getElementById('networkName').textContent = getChainName(walletData.chainId);

    walletConnect.classList.add('hidden');
    walletInfo.classList.remove('hidden');
}

async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const walletData = await getWalletInfo(web3);
            if (walletData) {
                updateWalletUI(walletData);
            }

            // Setup event listeners
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Error connecting to MetaMask. Please try again.');
        }
    } else {
        window.open('https://metamask.io/download/', '_blank');
    }
    walletOptions.classList.add('hidden');
}

async function connectCoinbase() {
    alert('Please install Coinbase Wallet extension');
    window.open('https://www.coinbase.com/wallet', '_blank');
    walletOptions.classList.add('hidden');
}

async function connectWalletConnect() {
    alert('WalletConnect integration requires additional setup');
    window.open('https://walletconnect.com/', '_blank');
    walletOptions.classList.add('hidden');
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        getWalletInfo(web3).then(updateWalletUI);
    }
}

function disconnectWallet() {
    web3 = null;
    walletConnect.classList.remove('hidden');
    walletInfo.classList.add('hidden');

    if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
}