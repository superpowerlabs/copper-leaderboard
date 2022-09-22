const fs = require("fs-extra");
const path = require("path");

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

module.exports = (app, extraConfig) => {
  let html;

  app.use("*", function (req, res, next) {
    if (req.params["0"] === "/") {
      res.send(getIndex(res, html));
    } else {
      next();
    }
  });

  app.use("/:anything", function (req, res, next) {
    let v = req.params.anything;
    switch (v) {
      case "favicon.png":
      case "favicon.ico":
      case "styles":
      case "all":
      case "images":
      case "bundle":
        next();
        break;
      default:
        res.send(getIndex(res, html));
    }
  });
};
