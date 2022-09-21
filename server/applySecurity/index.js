const helmet = require("helmet");
const limiter = require("./rate-limiter");
const fs = require("fs-extra");
const path = require("path");
const ip = require("./ip");
const CSP = require("./CSP");
const noCSPIfFirefox = require("./noCSPIfFirefox");
const nonce = require("./nonce");
const isFirefox = require("./isFirefox");

function getIndex(res, html) {
  if (!html) {
    html = fs.readFileSync(
      path.resolve(__dirname, "../../public/index.html"),
      "utf-8"
    );
  }
  if (res.locals.isFirefox === true) {
    return html;
  } else {
    return html
      .replace(/<script/g, `<script nonce="${res.locals.nonce}"`)
      .replace(/<link/g, `<link nonce="${res.locals.nonce}"`);
  }
}

module.exports = (app, html, extraConfig) => {
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
  app.use(isFirefox);
  app.use("*", function (req, res, next) {
    if (req.params["0"] === "/") {
      res.send(getIndex(res, html));
    } else {
      next();
    }
  });
};
