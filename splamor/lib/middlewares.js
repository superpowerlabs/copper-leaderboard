const csp = require("helmet-csp");
const crypto = require("crypto");

module.exports = {
  setNonce: function (req, res, next) {
    res.locals.nonce = crypto.randomBytes(16).toString("hex");
    next();
  },
  detectBrowser: function (req, res, next) {
    res.locals.isFirefox = /Firefox/.test(req.get("user-agent"));
    next();
  },
  limitCSPforFirefox: function (req, res, next) {
    if (res.locals.isFirefox) {
      res.removeHeader("content-security-policy");
    }
    next();
  },
  leaderboardCSP: function (req, res, next) {
    const directives = {
      "default-src": ["'self'", "*.mob.land"],
      "script-src": [
        "'self'",
        `'nonce-${res.locals.nonce}'`,
        "*.mob.land",
        "'unsafe-eval'",
      ],
      "connect-src": ["'self'", "https://ka-f.fontawesome.com/"],
      "style-src": [
        "'self'",
        `'nonce-${res.locals.nonce}'`,
        "'unsafe-hashes'",
        "fonts.googleapis.com/",
        "cdnjs.cloudflare.com/ajax/libs/bootstrap/",
        "use.fontawesome.com/releases/v6.0.0-beta1/",
      ],
      "font-src": ["'self'", "fonts.gstatic.com/", "use.fontawesome.com/"],
      "img-src": ["'self'", "*.mob.land/", "www.w3.org/"],
      // "media-src": [
      //   "'self'",
      //   "*.mob.land/",
      //   "www.w3.org/"
      // ]
    };
    if (res.locals.isFirefox) {
      directives["script-src-attr"] = null;
    }
    csp({
      useDefaults: true,
      directives,
    })(req, res, next);
  },
};
