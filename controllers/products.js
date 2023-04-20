const Product = require("../models/products");
const mongoose = require("mongoose");

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
    const newProduct = await product.save();
    res.status(201).send(newProduct);
  } catch (err) {
    next(err.message);
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid ID");
    }
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send("Product Not Found");
    }
  } catch (err) {
    next(err.message);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const all_products = await Product.find();
    res.status(200).json(all_products);
  } catch (err) {
    next(err.message);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid ID");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    next(err.message);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid ID");
    }
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(204).json(deletedProduct);
  } catch (err) {
    next(err.message);
  }
};
