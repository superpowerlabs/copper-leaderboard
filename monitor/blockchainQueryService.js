const ethers = require("ethers");
require("dotenv").config();
const { contracts, abi } = require("../client/config");
const dbManager = require("../server/lib/DbManager");

const queryService = {
  async getactualEvents() {
    for (let chainId in contracts) {
      const network =
        chainId === "42" ? "kovan" : chainId === "1" ? "homestead" : null;
      if (!network) {
        throw new Error("ChainId not recognized");
      }

      console.log(network);
      //let mymoni = 0;
      const provider = new ethers.providers.InfuraProvider(network);
      const contract = new ethers.Contract(contracts[chainId], abi, provider);
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
          
          //Make it so initial contract founding doesnt show in db
          if ( ! (wallet === "0x3Aa9e065d90DB8ECDc641F2AEB3268a3de33D2ca"))
          {
            const newinvestment = await dbManager.newInvestment(
              syn,
              wallet,
              hash,
              network
            );
            console.log(newinvestment);
          }
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
    }
  },
};

module.exports = queryService;
