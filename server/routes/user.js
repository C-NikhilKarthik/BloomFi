const router = require("express").Router();

const { getAggregatorPools } = require("../services/fetchPoolData");
// const { addLiquidityRoute } = require("../services/AddLiquidityToPool");

router.get("/fetch/pools", async (req, res) => {
  try {
    const pools = await getAggregatorPools();
    res.status(200).json(pools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.post("/add/liquidity", addLiquidityRoute);

module.exports = {
  use: "/user",
  router,
};
