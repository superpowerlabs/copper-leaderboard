const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const Logger = require("./lib/Logger");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiV1 = require("./routes/apiV1");

const applySecurity = require("./applySecurity");
let html;

process.on("uncaughtException", function (error) {
  Logger.error(error.message);
  Logger.error(error.stack);
});

const app = express();

applySecurity(app, html, {
  script: ["'unsafe-eval'"],
  connect: ["ka-f.fontawesome.com"],
  style: [
    "'unsafe-hashes'",
    "fonts.googleapis.com/",
    "cdnjs.cloudflare.com/ajax/libs/bootstrap/",
    "use.fontawesome.com/releases/v6.0.0-beta1/",
  ],
  font: ["fonts.gstatic.com/", "use.fontawesome.com/"],
  img: ["www.w3.org/"],
});

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
