module.exports = (req, res, next) => {
  if (/Firefox/.test(req.get("user-agent"))) {
    res.removeHeader("content-security-policy");
  }
  next();
};
