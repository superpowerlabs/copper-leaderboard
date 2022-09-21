module.exports = (req, res, next) => {
  res.locals.isFirefox = /Firefox/.test(req.get("user-agent"));
  next();
};
