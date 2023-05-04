const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();
const {
  createNewUser,
  login,
  getUser,
  editUser,
  deleteUser,
} = require("../controllers/users");
const { hasher } = require("../middlewares/hashPassword");

router.post("/", hasher, createNewUser);
router.post("/login", login);
router.put("/edit", verifyToken, editUser);
router.delete("/delete", verifyToken, deleteUser);
router.get("/:id", getUser);
module.exports = router;
