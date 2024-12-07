import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import TokenABI from "../abis/Token.json"
import CSAMMContract from "../abis/CSAMM.json"
import {
    ThermometerSnowflake,
    Coins,
    Wallet,
    PlusCircle,
    MinusCircle,
    AlertCircle
} from 'lucide-react';

const LiquidityVault = () => {
    // State variables
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [token0Contract, setToken0Contract] = useState(null);
    const [token1Contract, setToken1Contract] = useState(null);
    const [csammContract, setCsammContract] = useState(null);

    // Balances and amounts
    const [token0Balance, setToken0Balance] = useState('0');
    const [token1Balance, setToken1Balance] = useState('0');
    const [amount0, setAmount0] = useState('');
    const [amount1, setAmount1] = useState('');
    const [liquidityShares, setLiquidityShares] = useState('0');
    const [sharesToRemove, setSharestoRemove] = useState('');

    // Vault and ROI information
    const [vaultInfo, setVaultInfo] = useState({
        totalLiquidity: '0',
        reserve0: '0',
        reserve1: '0',
        userInitialLiquidity: '0',
        roi: null
    });

    // Alerts and connection states
    const [alert, setAlert] = useState({
        type: '',
        message: ''
    });
    const [isConnecting, setIsConnecting] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState({
        token0: false,
        token1: false
    });

    // Token details
    const [token0Details, setToken0Details] = useState({
        name: '',
        symbol: '',
        imageUrl: ''
    });
    const [token1Details, setToken1Details] = useState({
        name: '',
        symbol: '',
        imageUrl: ''
    });

    // Network and contract configuration
    const NETWORK_ID = '11155111'; // Sepolia testnet
    const CSAMM_CONTRACT_ADDRESS = "0xb1ba9DB205BA7162E46d4330091E8c2F40A65750";
    const TOKEN0_CONTRACT_ADDRESS = "0x5509CDD163d1aFE5Ec9D76876E2e8D05C959A850";
    const TOKEN1_CONTRACT_ADDRESS = "0xcE9210f785bb8cF106C8fbda90037B68d96610c2";

    // Show alert with timeout
    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    };

    // Fetch token details
    const fetchTokenDetails = async (tokenContract, setTokenDetails) => {
        try {
            const name = await tokenContract.methods.name().call();
            const symbol = await tokenContract.methods.symbol().call();
            const imageUrlHash = await tokenContract.methods.tokenImageUrl().call();
            const imageUrl = imageUrlHash;

            setTokenDetails({ name, symbol, imageUrl });
        } catch (error) {
            console.error('Error fetching token details:', error);
        }
    };

    // Connect wallet handler
    const connectWallet = useCallback(async () => {
        setIsConnecting(true);

        try {
            // Check if MetaMask is installed
            if (!window.ethereum) {
                showAlert('error', 'Please install MetaMask');
                return;
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Create Web3 instance
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            // Set current account
            setAccount(accounts[0]);

            // Create contract instances
            const token0ContractInstance = new web3Instance.eth.Contract(
                TokenABI.abi,
                TOKEN0_CONTRACT_ADDRESS
            );
            const token1ContractInstance = new web3Instance.eth.Contract(
                TokenABI.abi,
                TOKEN1_CONTRACT_ADDRESS
            );
            const csammContractInstance = new web3Instance.eth.Contract(
                CSAMMContract.abi,
                CSAMM_CONTRACT_ADDRESS
            );

            setToken0Contract(token0ContractInstance);
            setToken1Contract(token1ContractInstance);
            setCsammContract(csammContractInstance);

            // Fetch token details
            await fetchTokenDetails(token0ContractInstance, setToken0Details);
            await fetchTokenDetails(token1ContractInstance, setToken1Details);

            // Fetch balances and vault info
            await refreshBalances();
            await fetchVaultInfo();

            showAlert('success', 'Wallet connected successfully!');
        } catch (error) {
            showAlert('error', `Wallet connection failed: ${error.message}`);
            console.error(error);
        } finally {
            setIsConnecting(false);
        }
    }, []);

    // Initial connection and event listeners
    useEffect(() => {
        if (window.ethereum) {
            // Listen for account changes
            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    connectWallet();
                } else {
                    resetState();
                }
            };

            // Listen for network changes
            const handleChainChanged = () => window.location.reload();

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            // Attempt initial connection
            connectWallet();

            // Cleanup event listeners
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, [connectWallet]);

    // Reset state method
    const resetState = () => {
        setAccount('');
        setToken0Balance('0');
        setToken1Balance('0');
        setLiquidityShares('0');
        setVaultInfo({
            totalLiquidity: '0',
            reserve0: '0',
            reserve1: '0',
            userInitialLiquidity: '0',
            roi: null
        });
        setApprovalStatus({
            token0: false,
            token1: false
        });
    };

    // Fetch comprehensive vault information
    const fetchVaultInfo = async () => {
        if (!csammContract || !account || !web3) return;

        try {
            const totalLiquidity = await csammContract.methods.totalSupply().call();
            const reserve0 = await csammContract.methods.reserve0().call();
            const reserve1 = await csammContract.methods.reserve1().call();
            const initialLiquidity = await csammContract.methods.initialLiquidity(account).call();
            const roi = await csammContract.methods.calculateROI(account).call();
            const userShares = await csammContract.methods.balanceOf(account).call();

            setVaultInfo({
                totalLiquidity: web3.utils.fromWei(totalLiquidity, 'ether'),
                reserve0: web3.utils.fromWei(reserve0, 'ether'),
                reserve1: web3.utils.fromWei(reserve1, 'ether'),
                userInitialLiquidity: web3.utils.fromWei(initialLiquidity, 'ether'),
                roi: roi
            });

            setLiquidityShares(web3.utils.fromWei(userShares, 'ether'));
        } catch (error) {
            console.error('Error fetching vault info:', error);
            showAlert('error', 'Failed to fetch vault information');
        }
    };

    // Approve tokens for CSAMM contract
    const approveTokens = async () => {
        try {
            setAlert({ type: '', message: '' });

            if (!amount0 || !amount1) {
                showAlert('error', 'Please enter amounts for both tokens');
                return;
            }

            const amount0Wei = web3.utils.toWei(amount0, 'ether');
            const amount1Wei = web3.utils.toWei(amount1, 'ether');

            await token0Contract.methods.approve(CSAMM_CONTRACT_ADDRESS, amount0Wei)
                .send({ from: account });
            await token1Contract.methods.approve(CSAMM_CONTRACT_ADDRESS, amount1Wei)
                .send({ from: account });

            setApprovalStatus({
                token0: true,
                token1: true
            });

            showAlert('success', 'Tokens approved successfully!');
        } catch (error) {
            showAlert('error', `Approval failed: ${error.message}`);
            console.error(error);
        }
    };

    // Add liquidity to the pool
    const addLiquidity = async () => {
        try {
            setAlert({ type: '', message: '' });

            if (!amount0 || !amount1) {
                showAlert('error', 'Please enter amounts for both tokens');
                return;
            }

            if (!approvalStatus.token0 || !approvalStatus.token1) {
                showAlert('error', 'Please approve tokens before adding liquidity');
                return;
            }

            const amount0Wei = web3.utils.toWei(amount0, 'ether');
            const amount1Wei = web3.utils.toWei(amount1, 'ether');

            await csammContract.methods.addLiquidity(amount0Wei, amount1Wei)
                .send({ from: account });

            // Refresh data after adding liquidity
            await Promise.all([
                refreshBalances(),
                fetchVaultInfo()
            ]);

            showAlert('success', 'Liquidity added successfully!');
            setAmount0('');
            setAmount1('');
            setApprovalStatus({ token0: false, token1: false });
        } catch (error) {
            showAlert('error', `Add liquidity failed: ${error.message}`);
            console.error(error);
        }
    };

    // Remove Liquidity function
    const removeLiquidity = async () => {
        try {
            setAlert({ type: '', message: '' });

            if (!sharesToRemove || parseFloat(sharesToRemove) <= 0) {
                showAlert('error', 'Please enter a valid number of shares to remove');
                return;
            }

            const sharesToRemoveWei = web3.utils.toWei(sharesToRemove, 'ether');

            await csammContract.methods.removeLiquidity(sharesToRemoveWei)
                .send({ from: account });

            showAlert('success', 'Liquidity removed successfully!');

            await Promise.all([
                refreshBalances(),
                fetchVaultInfo()
            ]);

            setSharestoRemove('');
        } catch (error) {
            showAlert('error', `Remove liquidity failed: ${error.message}`);
            console.error(error);
        }
    };

    // Refresh balances
    const refreshBalances = async () => {
        if (!token0Contract || !token1Contract || !account) return;

        try {
            const balance0 = await token0Contract.methods.balanceOf(account).call();
            const balance1 = await token1Contract.methods.balanceOf(account).call();

            setToken0Balance(web3.utils.fromWei(balance0, 'ether'));
            setToken1Balance(web3.utils.fromWei(balance1, 'ether'));
        } catch (error) {
            console.error('Error refreshing balances:', error);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 text-black">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Liquidity Vault</h2>

                {/* Alert Component */}
                {alert.message && (
                    <div className={`
                        mb-4 p-4 rounded-lg flex items-center
                        ${alert.type === 'error'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'}
                    `}>
                        <AlertCircle className="mr-2" />
                        {alert.message}
                    </div>
                )}

                {/* Connect Wallet Button */}
                <div className="mb-4">
                    <button
                        onClick={connectWallet}
                        className={`
                            w-full py-2 rounded-lg transition duration-300
                            ${isConnecting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'}
                        `}
                        disabled={isConnecting}
                    >
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                </div>

                {/* Wallet Connected Content */}
                {account && (
                    <>
                        {/* Token Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {[
                                { details: token0Details, balance: token0Balance, type: 'token0' },
                                { details: token1Details, balance: token1Balance, type: 'token1' }
                            ].map(({ details, balance, type }) => (
                                <div key={type} className="border rounded-lg p-3 text-center">
                                    {details.imageUrl && (
                                        <img
                                            src={details.imageUrl}
                                            alt={`${details.name} logo`}
                                            className="w-16 h-16 mx-auto mb-2 rounded-full"
                                        />
                                    )}
                                    <div className="font-semibold">{details.name}</div>
                                    <div className="text-sm text-gray-600">{details.symbol}</div>
                                    <div className="text-xs text-gray-500 mt-1">Balance: {balance}</div>
                                </div>
                            ))}
                        </div>

                        {/* Vault Information */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Coins className="mr-2 text-blue-500" />
                                    <span className="font-medium">Total Vault Liquidity</span>
                                </div>
                                <span className="text-gray-700">{vaultInfo.totalLiquidity} Shares</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <PlusCircle className="mr-2 text-green-500" />
                                    <span className="font-medium">Your Initial Liquidity</span>
                                </div>
                                <span className="text-gray-700">{vaultInfo.userInitialLiquidity}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <ThermometerSnowflake className="mr-2 text-purple-500" />
                                    <span className="font-medium">Your ROI</span>
                                </div>
                                <span className="text-gray-700">
                                    {vaultInfo.roi !== null ? `${vaultInfo.roi}%` : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Liquidity Management */}
                        <div className="space-y-4">
                            {/* Add Liquidity Section */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Add Liquidity</h3>
                                <div className="space-y-3">
                                    <input
                                        type="number"
                                        placeholder={`${token0Details.symbol} Amount`}
                                        value={amount0}
                                        onChange={(e) => setAmount0(e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    <input
                                        type="number"
                                        placeholder={`${token1Details.symbol} Amount`}
                                        value={amount1}
                                        onChange={(e) => setAmount1(e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={approveTokens}
                                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
                                        >
                                            Approve Tokens
                                        </button>
                                        <button
                                            onClick={addLiquidity}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                                            disabled={!approvalStatus.token0 || !approvalStatus.token1}
                                        >
                                            Add Liquidity
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Remove Liquidity Section */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Remove Liquidity</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Wallet className="mr-2 text-gray-600" />
                                        <span>Your Liquidity Shares: {liquidityShares}</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Shares to Remove"
                                        value={sharesToRemove}
                                        onChange={(e) => setSharestoRemove(e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    <button
                                        onClick={removeLiquidity}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                                    >
                                        Remove Liquidity
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LiquidityVault;