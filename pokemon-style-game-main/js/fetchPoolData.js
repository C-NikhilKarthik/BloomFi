async function getAggregatorPools(type) {
    const query = `
              query MyQuery {
    poolGetAggregatorPools(
      first:10
      where: {chainIn: [
  ${type}], protocolVersionIn: 2}
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

        console.log(result.data.poolGetAggregatorPools)

        return result.data.poolGetAggregatorPools;
    } catch (error) {
        console.error("Error fetching aggregator pools:", error);
        return null;
    }
}

// // Usage
// getAggregatorPools().then((pools) => {
//     console.log(pools);
// });
