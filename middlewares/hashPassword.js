const bcrypt = require("bcrypt");

exports.hasher = async (req, res, next) => {
  const { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  req.body.password = hash;
  next();
};

exports.hashChangedPassword = async (plainText) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plainText, salt);
  return hash;
};
