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
  const newinvestment = await dbManager.newInvestment(req.body, "wallet", "tx_hash");
  res.json({
    success: true,
    newinvestment,
  });
});

module.exports = router;
