const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const cookieParser = require("cookie-parser");
const Logger = require("./lib/Logger");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiV1 = require("./routes/apiV1");

const applySecurity = require("./applySecurity");

process.on("uncaughtException", function (error) {
  Logger.error(error.message);
  Logger.error(error.stack);

  // if(!error.isOperational)
  //   process.exit(1)
});

let html;

function getIndex(res) {
  if (!html) {
    html = fs.readFileSync(
      path.resolve(__dirname, "../public/index.html"),
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

const app = express();

applySecurity(app, {
  connect: ["ka-f.fontawesome.com"],
  style: [
    "'unsafe-hashes'",
    "fonts.googleapis.com/",
    "cdnjs.cloudflare.com/ajax/libs/bootstrap/",
    "use.fontawesome.com/releases/v6.0.0-beta1/",
  ],
  font: ["fonts.gstatic.com/", "use.fontawesome.com/"],
  img: ["data:", "www.w3.org/"],
});

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.use((req, res, next) => {
  res.locals.isFirefox = /Firefox/.test(req.get("user-agent"));
  next();
});

app.use("/api/v1", apiV1);

app.use("/index.html", function (req, res) {
  res.redirect("/");
});

app.use("/healthcheck", function (req, res) {
  res.send("ok");
});

app.use("*", function (req, res, next) {
  if (req.params["0"] === "/") {
    res.send(getIndex(res));
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
