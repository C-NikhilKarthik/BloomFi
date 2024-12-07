const CHAIN_NAMES = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    137: 'Polygon Mainnet',
    80001: 'Mumbai Testnet'
};

function shortenAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatBalance(balance) {
    return parseFloat(balance).toFixed(4);
}

function getChainName(chainId) {
    return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
}

async function getWalletInfo(web3) {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return null;

    const address = accounts[0];
    const balance = await web3.eth.getBalance(address);
    const chainId = await web3.eth.getChainId();

    return {
        address,
        balance: web3.utils.fromWei(balance, 'ether'),
        chainId
    };
}