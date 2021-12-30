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

module.exports = router;
