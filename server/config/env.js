require("dotenv").config();

const { PORT, MONGODB_URI, RPC_URL, PRIVATE_KEY } = process.env;

const config = {
  PORT: PORT,
  MONGODB_URI,
  RPC_URL,
  PRIVATE_KEY,
};

module.exports = config;
