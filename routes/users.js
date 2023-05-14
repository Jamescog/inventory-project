const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();
const {
  createNewUser,
  login,
  getUser,
  editUser,
  deleteUser,
  logout,
} = require("../controllers/users");
const { hasher } = require("../middlewares/hashPassword");
const { checkTheOnwer } = require("../middlewares/checkOwner");

router.post("/", hasher, createNewUser);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.put("/edit", verifyToken, checkTheOnwer, editUser);
router.delete("/delete", verifyToken, deleteUser);
router.get("/:id", getUser);
module.exports = router;
