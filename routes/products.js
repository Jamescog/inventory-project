const express = require("express");
const { createNewProduct } = require("../controllers/products");
const router = express.Router();

router.post("/", createNewProduct);

module.exports = router;
