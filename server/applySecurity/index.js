const helmet = require("helmet");
const limiter = require("./rate-limiter");
const ip = require("./ip");
const CSP = require("./CSP");
const noCSPIfFirefox = require("./noCSPIfFirefox");
const nonce = require("./nonce");

module.exports = (app, extraConfig) => {
  let static_assets = extraConfig.static_assets || [];

  app.use("/:anything", function (req, res, next) {
    let v = req.params.anything;
    // if static_assets is not empty, we skip CSP for everything but index
    if (static_assets.length && static_assets.includes(v)) {
      next();
    } else {
      res.locals.isHome = true;
    }
  });

  app.use((req, res, next) => {
    if (res.locals.isHome) {
      helmet()(req, res, next);
    } else {
      next();
    }
  });

  app.use(ip);
  app.use(limiter);
  app.use(nonce);

  app.use((req, res, next) => {
    if (res.locals.isHome) {
      CSP(extraConfig)(req, res, next);
    } else {
      next();
    }
  });

  app.use(noCSPIfFirefox);
};
