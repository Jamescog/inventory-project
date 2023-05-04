const express = require("express");
const {
  createNewProduct,
  getOneProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  filterProduct,
} = require("../controllers/products");

const router = express.Router();
router.get("/filter", filterProduct);
router.post("/", createNewProduct);
router.get("/:id", getOneProduct);
router.get("/", getAllProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
module.exports = router;
