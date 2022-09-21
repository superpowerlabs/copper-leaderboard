(function () {
  // const limiter = require("./lib/rate-limiter");
  const middlewares = require("./lib/middlewares");

  function splarmor(options) {
    return function splamorMiddleware(req, res, next) {
      middlewares.setNonce(req, res, next);
      middlewares.detectBrowser(req, res, next);
      middlewares.leaderboardCSP(req, res, next);
      middlewares.limitCSPforFirefox(req, res, next);
      // TODO: call rate limiter as a middleware
      // limiter;

      next();
    };
  }

  // can pass either an options hash, an options delegate, or nothing
  module.exports = splarmor;
})();
