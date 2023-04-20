const Product = require("../models/products");

exports.createNewProduct = async (req, res, next) => {
  try {
    const { name, description, unitPrice, stock, category, images } = req.body;
    const product = new Product({
      name,
      description,
      unitPrice,
      stock,
      category,
      images,
    });
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    next(err.message);
  }
};
