const express = require("express");
const router = express.Router();
const dbManager = require("../lib/DbManager");

router.get("/investments", async (req, res) => {
  const investments = await dbManager.getInvestments();
  res.json({
    success: true,
    investments,
  });
});

router.post("/investment", async (req, res) => {
  const ammount = req.body;
  const wallet = req.body;
  const hash = req.txhash;
  const newinvestment = await dbManager.newInvestment(ammount, wallet, hash);
  res.json({
    success: true,
    newinvestment,
  });
});

module.exports = router;
