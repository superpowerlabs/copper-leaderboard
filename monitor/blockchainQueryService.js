const ethers = require("ethers");
require("dotenv").config();
const ERC20abi = require("./ERC20abi.json");
//const CONTRACT_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const CONTRACT_ADDRESS = "0x0f65a9629ae856a6fe3e8292fba577f478b944e0";
const dbManager = require("../server/lib/DbManager");
const { Address } = require("ethereumjs-util");
const network = process.env.NETWORK;

const queryService = {
  async getactualEvents() {
    console.log(network);
    //let mymoni = 0;
    const provider = new ethers.providers.InfuraProvider(network);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20abi, provider);
    const event = await contract.queryFilter(
      [contract.filters.Swap()],
      0,
      "latest"
    );
    //console.log(contract)
    for (let i = 0; i < event.length; i++) {
      if (event[i].topics.length === 4) {
        let syn = ethers.utils.formatEther(event[i].data);
        let wallet = ethers.utils.defaultAbiCoder.decode(
          ["address"],
          event[i].topics[event[i].topics.length - 1]
        )[0];
        if (event[i].topics[1] === event[i].topics[3]) {
          console.log("sell");
          wallet = ethers.utils.defaultAbiCoder.decode(
            ["address"],
            event[i].topics[event[i].topics.length - 2]
          )[0];
          syn = -syn;
        }
        const hash = event[i].transactionHash;
        console.log(syn);
        console.log(hash);
        console.log(wallet);
        console.log(event[i].topics);
        const newinvestment = await dbManager.newInvestment(
          syn,
          wallet,
          hash,
          network
        );
        console.log(newinvestment);
        // if (wallet === "0xAA31dd1bCc1075764790b1E2eD9670FEF34DCBFB") {
        //   mymoni = mymoni + Number(syn);
        // }
      }
    }

    //console.log(mymoni);
    console.log("starting listener");
    contract.on([contract.filters.Swap()], async (event) => {
      if (event.topics.length === 4) {
        let syn = ethers.utils.formatEther(event.data);
        let wallet = ethers.utils.defaultAbiCoder.decode(
          ["address"],
          event.topics[event.topics.length - 1]
        )[0];
        if (event.topics[1] === event.topics[3]) {
          console.log("sell");
          wallet = ethers.utils.defaultAbiCoder.decode(
            ["address"],
            event.topics[event.topics.length - 2]
          )[0];
          syn = -syn;
        }
        const hash = event.transactionHash;
        console.log(syn);
        console.log(hash);
        console.log(wallet);
        console.log(event.topics);
        const newinvestment = await dbManager.newInvestment(
          syn,
          wallet,
          hash,
          network
        );
        console.log(newinvestment);
      }
    });
  },
};

module.exports = queryService;
