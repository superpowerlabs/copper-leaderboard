let isDev;
if (typeof window !== "undefined") {
  isDev = /localhost/.test(window.location.hostname);
} else if (typeof process !== undefined && process.env) {
  isDev = process.env.NODE_ENV === "development";
}

const supportedId = {
  1: "Ethereum Mainnet",
};

if (isDev) {
  supportedId[1337] = "Local EVM";
  // supportedId[42] = "Kovan";
}

const config = {
  mainnetPoolId:
    "0xdda942bacbe6bd0c12e3ed2db45f0349e8c43101000200000000000000000131",
  auctionUrl: "https://bit.ly/3Kujw3k",
  mainnet: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2",
  supportedId,
  abi: require("./ABI.json"),
  // key: 'dcfb1f21611543539204b8757bf24809',
  season: 2,
  contracts: {
    42: "0x6d3cf40fe8649947f5fddfedc910b9bb09652ba7",
    //42: "0x0f65a9629ae856a6fe3e8292fba577f478b944e0",
    // 1: ""
  },
  isSynCity: /syn.city/.test(window.location.origin),
};

module.exports = config;
