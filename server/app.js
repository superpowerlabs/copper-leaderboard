const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const Logger = require("./lib/Logger");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const apiV1 = require("./routes/apiV1");
const helmet = require("helmet");
const fs = require("fs");
const pino = require("pino")("./logs/info.log");
const csp = require("helmet-csp");
const expressPino = require("express-pino-logger")({
  logger: pino,
});

const crypto = require("crypto");

process.on("uncaughtException", function (error) {
  Logger.error(error.message);
  Logger.error(error.stack);

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
        "'unsafe-inline'",
        `'nonce-${res.locals.nonce}'`,
        "*.mob.land",
        "'wasm-unsafe-eval'",
      ],
      "img-src": ["'self", "https: data: blob:"],
      "style-src": ["'self'", `'nonce-${res.locals.nonce}'`],
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

let indexText;

function getIndex() {
  if (!indexText) {
    indexText = fs.readFileSync(
      path.resolve(__dirname, "../public/index.html"),
      "utf-8"
    );
  }
  if (res.locals.isFirefox) {
    return indexText;
  } else {
    return indexText
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

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.use("/api/v1", apiV1);

app.use("/index.html", function (req, res) {
  res.redirect("/");
});

app.use("/healthcheck", function (req, res) {
  res.send("ok");
});

app.use("/:anything", function (req, res, next) {
  let v = req.params.anything;
  switch (v) {
    case "favicon.png":
    case "favicon.ico":
    case "styles":
    case "images":
    case "bundle":
      next();
      break;
    default:
      res.send(getIndex(res));
  }
});

app.use(express.static(path.resolve(__dirname, "../public")));

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

module.exports = app;
