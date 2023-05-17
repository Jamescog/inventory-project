const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const User = require("../models/users");
const Product = require("../models/products");
const expiredToken = require("../models/blacklistedtoken");
const { confrimEmail } = require("../utils/emailServices");
const { hashChangedPassword } = require("../middlewares/hashPassword");

exports.createNewUser = async (req, res) => {
  let { name, email, password } = req.body;
  const newUser = new User({
    name,
    password,
    email,
  });
  confrimEmail(name, email);
  const created = await newUser.save();
  const user = (({ id, name, email }) => ({
    id,
    name,
    email,
  }))(created);

  res.status(201).json({
    success: true,
    user,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Missing credentials(email or password)");
    error.status = 400;
    error.type = "custom";
    throw error;
  }

  const user = await User.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const id = user.id;
      const token = jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d",
      });
      res.cookie("accessToken", token, { httpOnly: true });
      res;
      return res.status(200).json({ success: true, accessToken: token });
    } else {
      const error = new Error("Incorrect Password");
      error.status = 400;
      error.type = "custom";
      throw error;
    }
  } else {
    const error = new Error("User with specified ID is not found!");
    error.status = 404;
    error.type = "custom";
    throw error;
  }
};

exports.logout = async (req, res) => {
  const blacklist = expiredToken({ token: req.user.token });
  await blacklist.save();

  res.status(200).json({
    success: false,
    message: `Logged out successfully`,
  });
};

exports.getUser = async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid user ID");
    error.status = 400;
    error.type = "custom";
    throw error;
  }

  const user = await User.findById(id).select("-password");
  const product = await Product.find({ addedBy: req.params.id }).lean();
  if (user) {
    user.products = product;
    return res.status(200).json({ success: true, user });
  } else {
    const error = new Error("User Not Found");
    error.status = 404;
    error.type = "custom";
    throw error;
  }
};

exports.editUser = async (req, res) => {
  console.log(req.user);
  const { id } = req.user;
  if (req.body.password) {
    req.body.password = await hashChangedPassword(req.body.password);
  }
  const update = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  }).select("-password");
  return res.status(200).json({
    success: true,
    user: update,
  });
};

exports.deleteUser = async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.id);
  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
};
