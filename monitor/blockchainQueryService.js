const Ethers = require("ethers");
require("dotenv").config();
const ERC20abi = require("./ERC20abi.json");
//const CONTRACT_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const CONTRACT_ADDRESS = "0x0f65a9629ae856a6fe3e8292fba577f478b944e0";
const dbManager = require("../server/lib/DbManager");
const START_BLOCK = 7700000;
const END_BLOCK = 7700100;

const queryService = {
  async getEvents() {
    const provider = new Ethers.providers.InfuraProvider("mainnet");
    const contract = new Ethers.Contract(CONTRACT_ADDRESS, ERC20abi, provider);
    const oldevents = await contract.queryFilter(
      "Transfer",
      START_BLOCK,
      END_BLOCK
    );
    for (let i = 0; i < oldevents.length; i++) {
      console.log(oldevents[i]);
      console.log(oldevents[i].transactionHash);
      console.log(oldevents[i].args.from);
      console.log(Ethers.utils.formatEther(oldevents[i].args.value));
      const etherValue = Ethers.utils.formatEther(oldevents[i].args.value);
      const hash = oldevents[i].transactionHash;
      const wallet = oldevents[i].args.from;
      const newinvestment = await dbManager.newInvestment(
        etherValue,
        wallet,
        hash
      );
      console.log(newinvestment);
    }

    contract.on("Transfer", async (from, to, value, event) => {
      console.log(event);
      const etherValue = Ethers.utils.formatEther(event.args.value);
      const hash = event.transactionHash;
      const wallet = event.args.from;
      const newinvestment = await dbManager.newInvestment(
        etherValue,
        wallet,
        hash
      );
      console.log(newinvestment);
    });
  },

  async getactualEvents() {
    const provider = new Ethers.providers.InfuraProvider("kovan");
    const contract = new Ethers.Contract(CONTRACT_ADDRESS, ERC20abi, provider);
    const decimal = await contract.decimals();
    console.log(decimal)
    const oldevents = await contract.queryFilter(
      [contract.filters.Swap()],0,"latest"
    );
    console.log(oldevents)
    console.log(old)
console.log("starting listener")
    contract.on([contract.filters.Swap()], async (poolId, tokenIn, tokenOut,amountIn,amountOut, event) => {
      console.log(event)
      console.log(tokenIn)
      console.log(tokenOut)
      console.log(amountIn)
      console.log(amountOut)
      // const etherValue = Ethers.utils.formatEther(event.args.value);
      // const hash = event.transactionHash;
      // const wallet = event.args.from;
      // const newinvestment = await dbManager.newInvestment(
      //   etherValue,
      //   wallet,
      //   hash
      // );
      // console.log(newinvestment);
    });
  },
  
};

module.exports = queryService;
