const express = require("express");
const router = express.Router();
const { createNewUser, login, getUser } = require("../controllers/users");
const { hasher } = require("../middlewares/hashPassword");

router.post("/", hasher, createNewUser);
router.get("/:id", getUser);

module.exports = router;
