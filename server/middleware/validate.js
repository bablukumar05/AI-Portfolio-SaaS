module.exports = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: "All fields required" });
  }
  next();
};