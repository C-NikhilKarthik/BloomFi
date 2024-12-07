import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import TokenABI from "../abis/Token.json"
import CSAMMContract from "../abis/CSAMM.json"

const CheckPage = () => {
    // State variables
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [token0Contract, setToken0Contract] = useState(null);
    const [token1Contract, setToken1Contract] = useState(null);
    const [csammContract, setCsammContract] = useState(null);
    const [token0Balance, setToken0Balance] = useState('0');
    const [token1Balance, setToken1Balance] = useState('0');
    const [amount0, setAmount0] = useState('');
    const [amount1, setAmount1] = useState('');
    const [roi, setRoi] = useState(null);
    const [alert, setAlert] = useState({
        type: '',
        message: ''
    });
    const [isConnecting, setIsConnecting] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState({
        token0: false,
        token1: false
    });

    // Network and contract configuration
    const NETWORK_ID = '11155111'; // Sepolia testnet
    const CSAMM_CONTRACT_ADDRESS = "0x7e2c53C0687267257d27d9D8B9F948b7e500F317";
    const TOKEN0_CONTRACT_ADDRESS = "0x3dcaa96095610216591849121383Cc6C2888f249";
    const TOKEN1_CONTRACT_ADDRESS = "0xdF9807DDF696163eADf474E9627c56F2115919D0";

    // Show alert with timeout
    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    };

    // Mint tokens for a specific token contract
    const mintTokens = async (tokenContract, amount) => {
        try {
            // Reset previous alerts
            setAlert({ type: '', message: '' });

            // Validate input
            if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
                showAlert('error', 'Please enter a valid amount to mint');
                return;
            }

            // Convert amount to Wei
            const amountWei = web3.utils.toWei(amount, 'ether');

            // Mint tokens
            await tokenContract.methods.mint(account, amountWei)
                .send({ from: account });

            // Refresh balance
            const balance = await tokenContract.methods.balanceOf(account).call();

            // Update balance based on which token was minted
            if (tokenContract._address === TOKEN0_CONTRACT_ADDRESS) {
                setToken0Balance(web3.utils.fromWei(balance, 'ether'));
            } else if (tokenContract._address === TOKEN1_CONTRACT_ADDRESS) {
                setToken1Balance(web3.utils.fromWei(balance, 'ether'));
            }

            showAlert('success', 'Tokens minted successfully!');
        } catch (error) {
            showAlert('error', `Token minting failed: ${error.message}`);
            console.error(error);
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

            // Fetch balances
            const balance0 = await token0ContractInstance.methods.balanceOf(accounts[0]).call();
            const balance1 = await token1ContractInstance.methods.balanceOf(accounts[0]).call();

            setToken0Balance(web3Instance.utils.fromWei(balance0, 'ether'));
            setToken1Balance(web3Instance.utils.fromWei(balance1, 'ether'));

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
                    setAccount('');
                    setToken0Balance('0');
                    setToken1Balance('0');
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

    // Approve tokens for CSAMM contract
    const approveTokens = async () => {
        try {
            // Reset previous alerts
            setAlert({ type: '', message: '' });

            // Validate inputs
            if (!amount0 || !amount1) {
                showAlert('error', 'Please enter amounts for both tokens');
                return;
            }

            // Convert amounts to Wei
            const amount0Wei = web3.utils.toWei(amount0, 'ether');
            const amount1Wei = web3.utils.toWei(amount1, 'ether');

            // Approve Token 0
            await token0Contract.methods.approve(CSAMM_CONTRACT_ADDRESS, amount0Wei)
                .send({ from: account });

            // Approve Token 1
            await token1Contract.methods.approve(CSAMM_CONTRACT_ADDRESS, amount1Wei)
                .send({ from: account });

            // Update approval status
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
            // Reset previous alerts
            setAlert({ type: '', message: '' });

            // Validate inputs and approvals
            if (!amount0 || !amount1) {
                showAlert('error', 'Please enter amounts for both tokens');
                return;
            }

            // Check if tokens are approved
            if (!approvalStatus.token0 || !approvalStatus.token1) {
                showAlert('error', 'Please approve tokens before adding liquidity');
                return;
            }

            // Convert amounts to Wei
            const amount0Wei = web3.utils.toWei(amount0, 'ether');
            const amount1Wei = web3.utils.toWei(amount1, 'ether');

            // Add liquidity
            await csammContract.methods.addLiquidity(amount0Wei, amount1Wei)
                .send({ from: account });

            // Calculate ROI
            const roiResult = await csammContract.methods.calculateROI(account).call();

            // Update ROI and balances
            setRoi(roiResult);
            showAlert('success', 'Liquidity added successfully!');

            // Refresh balances
            const balance0 = await token0Contract.methods.balanceOf(account).call();
            const balance1 = await token1Contract.methods.balanceOf(account).call();

            setToken0Balance(web3.utils.fromWei(balance0, 'ether'));
            setToken1Balance(web3.utils.fromWei(balance1, 'ether'));

            // Reset approval status
            setApprovalStatus({
                token0: false,
                token1: false
            });
        } catch (error) {
            showAlert('error', `Add liquidity failed: ${error.message}`);
            console.error(error);
        }
    };

    // Render component
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 text-black">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Liquidity Vault</h2>

                {/* Alert Component */}
                {alert.message && (
                    <div className={`
                        mb-4 p-4 rounded-lg 
                        ${alert.type === 'error'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'}
                    `}>
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

                {/* Connected Account Details */}
                {account && (
                    <div className="space-y-4">
                        {/* Connected Account */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Connected Account
                            </label>
                            <input
                                type="text"
                                value={account}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                            />
                        </div>

                        {/* Token 0 Balance and Deposit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Token 0 Balance
                            </label>
                            <div className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={token0Balance}
                                    readOnly
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                                <button
                                    onClick={() => mintTokens(token0Contract, '10')}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Mint 10
                                </button>
                            </div>
                            <input
                                type="number"
                                value={amount0}
                                onChange={(e) => setAmount0(e.target.value)}
                                placeholder="Enter amount to deposit"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        {/* Token 1 Balance and Deposit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Token 1 Balance
                            </label>
                            <div className="flex space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={token1Balance}
                                    readOnly
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                                <button
                                    onClick={() => mintTokens(token1Contract, '10')}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Mint 10
                                </button>
                            </div>
                            <input
                                type="number"
                                value={amount1}
                                onChange={(e) => setAmount1(e.target.value)}
                                placeholder="Enter amount to deposit"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={approveTokens}
                                className={`
                                    flex-1 py-2 rounded-lg transition duration-300
                                    ${!amount0 || !amount1
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'}
                                `}
                                disabled={!amount0 || !amount1}
                            >
                                Approve Tokens
                            </button>
                            <button
                                onClick={addLiquidity}
                                className={`
                                    flex-1 py-2 rounded-lg transition duration-300
                                    ${!amount0 || !amount1 || !approvalStatus.token0 || !approvalStatus.token1
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white'}
                                `}
                                disabled={!amount0 || !amount1 || !approvalStatus.token0 || !approvalStatus.token1}
                            >
                                Add Liquidity
                            </button>
                        </div>

                        {/* ROI Display */}
                        {roi !== null && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Return on Investment (ROI)
                                </label>
                                <input
                                    type="text"
                                    value={`${roi}%`}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckPage;