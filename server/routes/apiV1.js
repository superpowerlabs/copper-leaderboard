const express = require("express");
const router = express.Router();
const dbManager = require("../lib/DbManager");

router.get("/investments", async (req, res) => {
  const { chainId } = req.query;
  const network =
    chainId === "42" ? "kovan" : chainId === "1" ? "homestead" : null;
  if (!network) {
    throw new Error("ChainId not recognized");
  }
  const investments = await dbManager.getInvestments(network);
  res.json({
    success: true,
    investments,
  });
});

// router.post("/investment", async (req, res) => {
//   // const ammount = req.body;
//   // const wallet = req.body;
//   // const hash = req.txhash;
//   const newinvestment = await dbManager.newInvestment(5, "wallet", "tx_hash");
//   res.json({
//     success: true,
//     newinvestment,
//   });
// });

module.exports = router;
