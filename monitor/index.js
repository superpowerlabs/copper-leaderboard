require("dotenv").config();
const monitor = require("./Monitor");
const queryService = require("./blockchainQueryService");

function main() {
  console.log("starting monitor");
  queryService.getInvestments();
  //queryService.getOldEvents();
  //queryService.getNewEvents();
  //await monitor.start();
}

main();
