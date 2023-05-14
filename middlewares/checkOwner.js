const mongoose = require("mongoose");
const Product = require("../models/products");
const User = require("../models/users");
const hasher = require("./hashPassword");

exports.checkTheOnwer = (req, res, next) => {
  const { email } = req.user;
  if (!req.user) {
    const err = Error("Please send your Access Token");
    err.type = "custom";
    err.status = 400;
    throw err;
  }
  next();
};
