const Web3 = require("web3");
require("dotenv").config();
//const web3 = new Web3( "wss://mainnet.infura.io/ws/v3/" + process.env.INFURA_KEY );
const web3 = new Web3(
  "wss://mainnet.infura.io/ws/v3/" + "a5d8ae5cf48e49269d71a5cf25289c0d"
);
const ERC20abi = require("./ERC20abi.json");
const CONTRACT_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const dbManager = require("../server/lib/DbManager");

const queryService = {
  getOldEvents() {
    const contract = new web3.eth.Contract(ERC20abi, CONTRACT_ADDRESS);
    const START_BLOCK = 7700000;
    const END_BLOCK = 7700100;
    contract
      .getPastEvents("Transfer", {
        fromBlock: START_BLOCK,
        toBlock: END_BLOCK, // You can also specify 'latest'
      })
      .then(async (events) => {
        //console.log(events)
        for (let i = 0; i < events.length; i++) {
          console.log(events[i].transactionHash);
          console.log(events[i].returnValues.from);
          console.log(events[i].returnValues.value);
          const etherValue = Web3.utils.fromWei(
            events[i].returnValues.value,
            "ether"
          );
          const hash = events[i].transactionHash;
          const wallet = events[i].returnValues.from;

          const newinvestment = await dbManager.newInvestment(
            etherValue,
            wallet,
            hash
          );
          console.log(newinvestment);
        }
      })
      .catch((err) => console.error(err));
  },
  getNewEvents() {
    const contract = new web3.eth.Contract(ERC20abi, CONTRACT_ADDRESS);
    contract.events
      .Transfer()
      .on("data", async (event) => {
        console.log(event);
        const hash = event.transactionHash;
        const wallet = event.returnValues.from;
        const etherValue = Web3.utils.fromWei(
          event.returnValues.value,
          "ether"
        );

        const newinvestment = await dbManager.newInvestment(
          etherValue,
          wallet,
          hash
        );
        console.log(newinvestment);
      })
      .on("error", console.error);
  },
};
module.exports = queryService;
