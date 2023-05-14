const express = require("express");
const {
  createNewProduct,
  getOneProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  filterProduct,
  searchProducts,
  stockReports,
  sellProduct,
} = require("../controllers/products");

const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/filter", filterProduct);
router.get("/stock_report", stockReports);
router.post("/", verifyToken, createNewProduct);
router.put("/:id", verifyToken, updateProduct);
router.put("/sell_product/:id", verifyToken, sellProduct);
router.delete("/:id", verifyToken, deleteProduct);
router.get("/:id", getOneProduct);
module.exports = router;
