const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const User = require("../models/users");

exports.createNewUser = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    const newUser = new User({
      name,
      password,
      email,
    });
    const created = await newUser.save();
    const user = (({ id, name, email }) => ({
      id,
      name,
      email,
    }))(created);
    res.status(201).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Missing email or password");
    }

    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const id = user.id;
        const token = jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });
        res.cookie("accessToken", token, { httpOnly: true });
        return res.status(200).json({ success: true });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect Password" });
      }
    } else {
      res.status(401).json({ success: false, message: "User Not Found" });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }
    const user = await User.findById(id).select("-password");
    if (user) {
      return res.status(200).json({ success: true, user });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.editUser = async (req, res) => {
  try {
    const { id } = req.user;
    const update = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password");
    return res.status(200).json({
      success: true,
      user: update,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.id);
    return res.status(20).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
