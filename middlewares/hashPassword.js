const bcrypt = require("bcrypt");

exports.hasher = async (req, res, next) => {
  const { password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    req.body.password = hash;
    next();
  } catch (err) {
    next(err.massage);
  }
};
