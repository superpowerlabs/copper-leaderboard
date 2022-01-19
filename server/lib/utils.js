const ethers = require("ethers");
const { Contract } = require("@ethersproject/contracts");
const config = require("../../client/config");
// const _ = require('lodash')

const contracts = {};

const utils = {
  sleep: async (millis) => {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setTimeout(resolve, millis));
  },

  getContract(chainId, contractName) {
    chainId = chainId.toString();
    if (config.supportedId[chainId]) {
      if (!contracts[chainId]) {
        contracts[chainId] = {};
      }
      if (!contracts[chainId][contractName]) {
        let provider;
        if (chainId === "1337") {
          provider = new ethers.providers.JsonRpcProvider();
        } else {
          provider = new ethers.providers.InfuraProvider(
            chainId === "4" ? "rinkeby" : "homestead",
            process.env.INFURA_API_KEY
          );
        }
        contracts[chainId][contractName] = new Contract(
          config.address[chainId][contractName],
          config.abi[contractName],
          provider
        );
      }
      return contracts[chainId][contractName];
    }
    return false;
  },

  // check if it is on mainnet before adding it
  async addToken(
    address = "0xbc6E06778708177a18210181b073DA747C88490a",
    symbol = "SYNR",
    image = "https://data.syn.city/assets/SynCityLogo97x97Black.png",
    decimals = 18
  ) {
    if (typeof window.ethereum !== "undefined") {
      try {
        return window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address,
              symbol,
              decimals,
              image,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  },
};

module.exports = utils;
