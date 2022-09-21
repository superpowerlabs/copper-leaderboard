// rate-limiter.js
const rateLimiter = require("express-rate-limit");

const limiter = rateLimiter({
  max: 60, // max number of requests a user can make within a specified timeframe
  windowMS: 10000, // 10 seconds
  message: "You can't make any more requests at the moment. Try again later",
});

module.exports = limiter;
