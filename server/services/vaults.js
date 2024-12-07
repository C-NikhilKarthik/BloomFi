require("dotenv").config();
const { ethers } = require("ethers");

// Load environment variables
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Contract details
const VAULT_ADDRESS = "0xYourVaultContractAddress"; // Replace with Vault contract address
const TOKEN_ADDRESS = "0xYourERC20TokenAddress"; // Replace with ERC20 token contract address
const VAULT_ABI = require("../contracts/vaults.sol/Vault.json");
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
];

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Initialize contract instances
const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, wallet);
const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

/**
 * Approves the Vault contract to spend the specified amount of tokens.
 * @param {ethers.BigNumber} amount - The amount of tokens to approve.
 */
async function approveVault(amount) {
  console.log(
    `Approving Vault to spend ${ethers.formatUnits(amount, 18)} tokens...`
  );
  const tx = await token.approve(VAULT_ADDRESS, amount);
  await tx.wait();
  console.log("Approval successful!");
}

/**
 * Deposits tokens into the Vault.
 * @param {ethers.BigNumber} amount - The amount of tokens to deposit.
 */
async function depositTokens(amount) {
  console.log(
    `Depositing ${ethers.formatUnits(amount, 18)} tokens into Vault...`
  );
  const tx = await vault.deposit(amount);
  await tx.wait();
  console.log("Deposit successful!");
}

/**
 * Withdraws tokens from the Vault based on shares.
 * @param {ethers.BigNumber} shares - The number of shares to withdraw.
 */
async function withdrawTokens(shares) {
  console.log(
    `Withdrawing tokens equivalent to ${ethers.formatUnits(
      shares,
      18
    )} shares...`
  );
  const tx = await vault.withdraw(shares);
  await tx.wait();
  console.log("Withdrawal successful!");
}

/**
 * Gets the Vault balance of the user.
 * @returns {ethers.BigNumber} The balance of shares.
 */
async function getVaultBalance() {
  const balance = await vault.balanceOf(wallet.address);
  console.log(`Your Vault balance: ${ethers.formatUnits(balance, 18)} shares`);
  return balance;
}

/**
 * Gets the user's token balance.
 * @returns {ethers.BigNumber} The token balance.
 */
async function getTokenBalance() {
  const balance = await token.balanceOf(wallet.address);
  console.log(`Your token balance: ${ethers.formatUnits(balance, 18)} tokens`);
  return balance;
}

/**
 * Main function to demonstrate Vault interactions.
 */
async function main() {
  try {
    const amountToDeposit = ethers.parseUnits("10", 18); // Replace with desired deposit amount

    // Approve tokens for Vault
    await approveVault(amountToDeposit);

    // Deposit tokens into Vault
    await depositTokens(amountToDeposit);

    // Get the user's Vault balance
    const shares = await getVaultBalance();

    // Withdraw tokens from the Vault
    await withdrawTokens(shares);

    // Check token balance after withdrawal
    await getTokenBalance();
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

main();
