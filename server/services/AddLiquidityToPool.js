const { AddLiquidity } = require("@balancer-labs/sdk"); // Assuming Balancer SDK
const { ethers } = require("ethers");

async function addLiquidityRoute(req, res) {
  try {
    const { poolId, tokens, amounts, slippage, walletAddress } = req.body;

    if (!poolId || !tokens || !amounts || !walletAddress) {
      return res.status(400).json({
        error: "Missing required parameters",
      });
    }

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const poolState = await fetchPoolState(poolId, provider);

    const queryInput = {
      poolId,
      tokens,
      amounts,
      sender: walletAddress,
    };

    const queryResult = await AddLiquidity.query(queryInput, poolState);

    const buildCallInput = {
      poolId,
      tokens,
      amounts,
      minimumBPT: queryResult.bptOut * (1 - slippage / 100),
      sender: walletAddress,
    };

    const txCall = AddLiquidity.buildCall(buildCallInput);

    const tx = await signer.sendTransaction({
      to: txCall.to,
      data: txCall.data,
      value: txCall.value || 0,
    });

    res.status(200).json({
      transactionHash: tx.hash,
      bptOut: queryResult.bptOut,
      message: "Liquidity added successfully",
    });
  } catch (error) {
    console.error("Add Liquidity Error:", error);
    res.status(500).json({
      error: "Failed to add liquidity",
      details: error.message,
    });
  }
}

async function fetchPoolState(poolId, provider) {
  const poolContract = new ethers.Contract(
    poolId,
    [
      "function getPoolTokens() public view returns (address[], uint256[], uint256)",
    ],
    provider
  );

  const [tokens, balances, lastChangeBlock] =
    await poolContract.getPoolTokens();

  return {
    poolId,
    tokens,
    balances,
    lastChangeBlock,
  };
}

module.exports = {
  addLiquidityRoute,
};
