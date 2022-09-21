const helmet = require("helmet");
const limiter = require("./rate-limiter");
const ip = require("./ip");
const CSP = require("./CSP");
const noCSPIfFirefox = require("./noCSPIfFirefox");
const nonce = require("./nonce");

module.exports = (app, extraConfig) => {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(ip);
  app.use(limiter);
  app.use(nonce);
  app.use(CSP(extraConfig));
  app.use(noCSPIfFirefox);
};
