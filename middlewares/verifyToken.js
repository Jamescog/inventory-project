const User = require("../models/users");
const ExpiredToken = require("../models/blacklistedtoken");
const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (token) {
    const isRevoked = await ExpiredToken.findOne({ token });
    if (isRevoked) {
      return res.status(401).json({
        success: false,
        message: `You're logged out, please login to get an acess`,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!(await User.findById(decoded.id))) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = decoded;
    req.user.token = token;
    next();
  }
};
