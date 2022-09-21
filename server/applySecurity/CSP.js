const csp = require("helmet-csp");
const _ = require("lodash");

const defaultConf = {
  default: ["'self'", "*.mob.land", "*.google-analytics.com"],

  script: [
    "'self'",
    "*.mob.land",
    "'wasm-unsafe-eval'",
    "*.googletagmanager.com",
  ],
  connect: ["'self'", "*.mob.land"],
  font: ["'self'", "*.mob.land"],
  img: ["'self'", "*.mob.land"],
  style: ["'self'", "*.mob.land"],
};

module.exports = (extraConf) => (req, res, next) => {
  let conf = {};
  for (let key of Object.keys(defaultConf)) {
    conf[key] = _.clone(defaultConf[key]);
    for (let val of extraConf[key] || []) {
      conf[key].push(val);
    }
  }
  conf.script.push(`'nonce-${res.locals.nonce}'`);
  const directives = {
    "default-src": conf.default,
    "script-src": conf.script,
    "connect-src": conf.connect,
    "font-src": conf.font,
    "img-src": conf.img,
    "style-src": conf.style,
  };
  csp({
    useDefaults: true,
    directives,
  })(req, res, next);
};
