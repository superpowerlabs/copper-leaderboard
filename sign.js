require("dotenv").config();
const { validator, validator2 } = require("./env.json");
const ethers = require("ethers");
const [, , hash, nodeEnv] = process.argv;
const signingKey = new ethers.utils.SigningKey(
  nodeEnv === "development" ? validator2 : validator
);
const signedDigest = signingKey.signDigest(hash);
console.info(ethers.utils.joinSignature(signedDigest));
