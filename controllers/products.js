const Product = require("../models/products");
const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

exports.createNewProduct = async (req, res, next) => {
  try {
    const expectedFields = [
      "name",
      "description",
      "unitPrice",
      "stock",
      "category",
      "images",
    ];

    let missingFields = [];

    expectedFields.forEach((field) => {
      if (!req.body.hasOwnProperty(field)) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

    const product = new Product(req.body);
    const newProduct = await product.save();
    console.log(newProduct);
    return res.status(201).json({
      success: true,
      newProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Product ID: ${req.params.id}`,
      });
    }
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.status(200).json({ success: true, product });
    } else {
      return res.status(404).json({
        success: false,
        message: `Product with id ${req.params.id} Not Found`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const all_products = await Product.paginate({}, { page, limit });
    return res.status(200).json({ success: true, all_products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    console.log(req.params);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Product ID: ${req.params.id}`,
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json({ success: true, updatedProduct });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Product ID: ${req.params.id}`,
      });
    }
    const product = await Product.findById(req.params.id);
    if (product) {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      res.status(204).json({ success: true, deletedProduct });
    } else {
      return res.status(404).send({
        success: false,
        message: `Product with id ${req.params.id} Not Fund `,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.filterProduct = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const page = Number(req.query) || 1;
    const limit = Number(req.query) || 5;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (minPrice && maxPrice) {
      filter.unitPrice = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    } else if (minPrice) {
      filter.unitPrice = { $gte: parseInt(minPrice) };
    } else if (maxPrice) {
      filter.unitPrice = { $lte: parseInt(maxPrice) };
    }

    result = await Product.paginate(filter, { page, limit });
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
