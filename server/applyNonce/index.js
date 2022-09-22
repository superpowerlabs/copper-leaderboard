const fs = require("fs-extra");
const path = require("path");

function getIndex(html, index_file) {
  if (!html) {
    html = fs.readFileSync(path.resolve(__dirname, index_file), "utf-8");
  }
  return html;
}

function insertNonce(res, html, index_file) {
  html = getIndex(html, index_file);
  if (res.locals.isFirefox === true) {
    return html;
  } else {
    return html
      .replace(/<script/g, `<script nonce="${res.locals.nonce}"`)
      .replace(/<link/g, `<link nonce="${res.locals.nonce}"`)
      .replace(/<style/g, `<style nonce="${res.locals.nonce}"`);
  }
}

module.exports = (app, extraConfig) => {
  let html;
  // TODO check path to index, set default?
  let index_file = extraConfig.index_file;
  let static_assets = extraConfig.static_assets || [];

  app.use("*", function (req, res, next) {
    if (req.params["0"] === "/") {
      res.send(insertNonce(res, html, index_file));
    } else {
      next();
    }
  });

  app.use("/:anything", function (req, res, next) {
    let v = req.params.anything;
    if (static_assets.includes(v)) {
      next();
    } else {
      res.send(insertNonce(res, html, index_file));
    }
  });
};
