const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.createNewUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      password,
      email,
    });
    await newUser.save();

    res.status(201).json({
      name,
      email,
    });

    next();
  } catch (error) {
    next(error.message);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || password) {
      return res.status(400).send("Missing email or password");
    }

    const user = await User.findOne({ email });
    if (user) {
      if (password === user.password) {
        const userId = user.id;
        console.log(userId);
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({ userId, email, token });
      } else {
        return res.status(401).send("Incorrect Password");
      }
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (err) {
    next(err.message);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    console.log(user.name);
    if (user) {
      res.status(200).json(user);
      next();
    } else {
      return res.status(404).send("User Not Found");
    }
  } catch (err) {
    next(err.message);
  }
};
