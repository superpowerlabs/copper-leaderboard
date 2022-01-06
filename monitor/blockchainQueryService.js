const ethers = require("ethers");
require("dotenv").config();
const ERC20abi = require("./ERC20abi.json");
//const CONTRACT_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const CONTRACT_ADDRESS = "0x0f65a9629ae856a6fe3e8292fba577f478b944e0";
const dbManager = require("../server/lib/DbManager");
const { Address } = require("ethereumjs-util");
const START_BLOCK = 7700000;
const END_BLOCK = 7700100;

const queryService = {
  async getactualEvents() {
    const provider = new ethers.providers.InfuraProvider("kovan");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20abi, provider);
    const event = await contract.queryFilter(
      [contract.filters.Swap()],
      0,
      "latest"
    );
    //console.log(contract)
    for (let i = 0; i < event.length; i++) {
      if(event[i].topics.length === 4){
        const wallet = ethers.utils.defaultAbiCoder.decode(['address'] ,event[i].topics[event[i].topics.length-1])[0];
        const syn = ethers.utils.formatEther(event[i].data);
        const hash = event[i].transactionHash;
        console.log(syn);
        console.log(hash);
        console.log(wallet);
        //console.log(oldevents[i])
        const newinvestment = await dbManager.newInvestment(
          syn,
          wallet,
          hash
        );
        console.log(newinvestment);
        }
    }
    console.log("starting listener");
    contract.on([contract.filters.Swap()], async (event) => {
      if(event.topics.length === 4){
        const wallet = ethers.utils.defaultAbiCoder.decode(['address'] ,event.topics[event.topics.length-1])[0];
        const syn = ethers.utils.formatEther(event.data);
        const hash = event.transactionHash;
        console.log(syn);
        console.log(hash);
        console.log(wallet);
        //console.log(event)
        const newinvestment = await dbManager.newInvestment(
          syn,
          wallet,
          hash
        );
        console.log(newinvestment);
        }
      
    });
  },
};

module.exports = queryService;
