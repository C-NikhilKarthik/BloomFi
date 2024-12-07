export async function getAggregatorPools() {
  const query = `
            query MyQuery {
  poolGetAggregatorPools(
    first:100
    where: {chainIn: [
SEPOLIA], protocolVersionIn: 3}
  ) {
    
    id
    type
    address
    createTime
    symbol
    chain
    name
    poolTokens {
      address
      weight
      symbol
      name
      decimals
      scalingFactor
      balanceUSD
      underlyingToken {
        address
        underlyingTokenAddress
        description
        symbol
        name
        decimals
      }
    }
    protocolVersion
  }
}
      `;

  try {
    const response = await fetch("https://test-api-v3.balancer.fi/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if required
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    return result.data.poolGetAggregatorPools;
  } catch (error) {
    console.error("Error fetching aggregator pools:", error);
    return null;
  }
}

// Usage
getAggregatorPools().then((pools) => {
  console.log(pools);
});
