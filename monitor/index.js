require("dotenv").config();
const monitor = require("./Monitor");
const queryService = require("./blockchainQueryService");

function main() {
  console.log("starting monitor");
  queryService.getEvents();
}

main();
