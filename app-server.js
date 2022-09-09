require("dotenv").config();
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const fs = require("fs");
const pino = require("pino")("./logs/info.log");
const csp = require("helmet-csp");
const expressPino = require("express-pino-logger")({
  logger: pino,
});

const crypto = require("crypto");

process.on("uncaughtException", function (error) {
  console.error(error.message);
  console.error(error.stack);
  // if(!error.isOperational)
  //   process.exit(1)
});

const app = express();
app.use(expressPino);
app.use(helmet());

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("hex");
  res.locals.isFirefox = /Firefox/.test(req.get("user-agent"));
  next();
});

app.use((req, res, next) => {
  csp({
    useDefaults: true,
    directives: {
      "default-src": ["'self'", "api.coingecko.com", "*.mob.land"],
      "script-src": [
        "'self'",
        `'nonce-${res.locals.nonce}'`,
        "*.mob.land",
        "'wasm-unsafe-eval'",
      ],
      "styles-src": ["'self'", `'nonce-${res.locals.nonce}'`],
      "script-src-attr": null,
    },
  })(req, res, next);
});

app.use((req, res, next) => {
  if (res.locals.isFirefox) {
    res.removeHeader("content-security-policy");
  }
  next();
});

app.disable("x-powered-by");

const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 60,
  keyGenerator: (req) => {
    const ip =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress;
    return ip;
  },
});

app.use(limiter);

let html;

function getIndex(res) {
  if (!html) {
    html = fs.readFileSync(
      path.resolve(__dirname, "build0/index.html"),
      "utf-8"
    );
  }
  if (res.locals.isFirefox) {
    return html;
  } else {
    return html
      .replace(
        /script src="\/static\/js/g,
        `script nonce="${res.locals.nonce}" src="/static/js`
      )
      .replace(
        /link href="\/static\/css/g,
        `link nonce="${res.locals.nonce}" href="/static/css`
      );
  }
}

app.use("/index.html", function (req, res) {
  res.redirect("/");
});

app.use("/:anything", function (req, res, next) {
  let v = req.params.anything;
  if (/\.module.aswm$/.test(v)) {
    next();
  } else {
    switch (v) {
      case "favicon.png":
      case "asset-manifest.json":
      case "static":
      case "images":
      case "bundle":
      case "logo192.png":
      case "logo512.png":
        next();
        break;
      default:
        res.send(getIndex(res));
    }
  }
});

app.use(express.static(path.resolve(__dirname, "./build0")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      title: "Error",
      message: err.message,
      error: err,
    });
  });
}

// error handler
app.use(function (err, req, res, next) {
  if (err.status !== 404) {
    console.debug(err);
    console.debug(err.status);
    console.debug(err.message);
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: "Error" });
});

const port = 3004;

app.listen(port, () => {
  console.info("Listening to", port, process.env.NODE_ENV);
});
