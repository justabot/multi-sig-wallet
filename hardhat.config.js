require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  networks: {
    hardhat: {
      accounts: {
        count: 10,
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: process.env.SEPOLIA_PRIVATE_KEY !== undefined ? [process.env.SEPOLIA_PRIVATE_KEY] : []
    },
  },
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
