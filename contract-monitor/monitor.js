require("dotenv").config();
const dbManager = require("../server/lib/DbManager");
const { getContract, sleep } = require("../server/lib/utils");
const ethers = require("ethers");

const ids = {};

const chainId = parseInt(process.env.CHAIN_ID);
const startAt = parseInt(process.env.START_AT);

async function loopIds(synCityPasses) {
  let last;
  for (let j = 0; j < 10000; j++) {
    if (Object.keys(ids).length === 200) {
      console.info("Minting completed");
      process.exit();
    }
    console.info("Round", j);
    for (let i = startAt; i < startAt + 200; i++) {
      if (ids[i]) {
        continue;
      }
      try {
        let redeemer = await synCityPasses.ownerOf(i);
        if (redeemer) {
          ids[i] = redeemer;
          const row = await dbManager.getData({
            redeemer,
          });
          if (!row.redeemed) {
            if (row && row.redeemer) {
              await dbManager.setCodeAsUsed(row.full_username, i);
            }
            console.info("Added", row.full_username, redeemer, i);
          } else {
            console.info("Previously added", row.full_username, redeemer, i);
          }
          last = i;
        }
      } catch (e) {
        if (last && i > last + 10) {
          console.info("Pausing at", i);
          break;
        }
        // console.log(e)
        // console.info('Still not minted', i)
      }
      await sleep(1500);
    }
    await sleep(20000);
  }
}

async function main(redeemer) {
  let synCityPasses = getContract(chainId, "SynCityPasses");
  await loopIds(synCityPasses);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(chalk.red(e.message));
    process.exit(1);
  });
