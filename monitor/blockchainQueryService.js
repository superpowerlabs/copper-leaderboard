const Ethers = require("ethers");
require("dotenv").config();
const ERC20abi = require("./ERC20abi.json");
//const CONTRACT_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const CONTRACT_ADDRESS = "0x0f65a9629ae856a6fe3e8292fba577f478b944e0";
const dbManager = require("../server/lib/DbManager");
const START_BLOCK = 7700000;
const END_BLOCK = 7700100;

const queryService = {
  async getactualEvents() {
    const provider = new Ethers.providers.InfuraProvider("kovan");
    const contract = new Ethers.Contract(CONTRACT_ADDRESS, ERC20abi, provider);
    const oldevents = await contract.queryFilter(
      [contract.filters.Swap()],
      0,
      "latest"
    );
    for (let i = 0; i < oldevents.length; i++) {
      if (oldevents[i].event == "Transfer") {
        //console.log(oldevents[i])
        const etherValue = Ethers.utils.formatEther(oldevents[i].args.value);
        const hash = oldevents[i].transactionHash;
        const wallet = oldevents[i].args.to;
        console.log(etherValue);
        const newinvestment = await dbManager.newInvestment(
          etherValue,
          wallet,
          hash
        );
        console.log(newinvestment);
      }
    }
    console.log("starting listener");
    contract.on([contract.filters.Swap()], async (event) => {
      if (event.event == "Transfer") {
        console.log(event);
        const etherValue = Ethers.utils.formatEther(event.args.value);
        const hash = event.transactionHash;
        const wallet = event.args.to;
        console.log(etherValue, hash, wallet);
        const newinvestment = await dbManager.newInvestment(
          etherValue,
          wallet,
          hash
        );
        console.log(newinvestment);
      }
    });
  },
};

module.exports = queryService;
