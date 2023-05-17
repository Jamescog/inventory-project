const Product = require("../models/products");
const Review = require("../models/review");
const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const { query } = require("express");

exports.createNewProduct = async (req, res, next) => {
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
    const error = new Error(`Missing fields: ${missingFields.join(", ")}`);
    error.status = 400;
    error.type = "custom";
    throw error;
  }
  req.body.addedBy = req.user.id;
  const product = new Product(req.body);
  const newProduct = await product.save();
  return res.status(201).json({
    success: true,
    newProduct,
  });
};

exports.getOneProduct = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error(`Invalid Product ID: ${req.params.id}`);
    error.status = 400;
    error.type = "custom";
    throw error;
  }
  const product = await Product.findById(req.params.id).populate({
    path: "addedBy",
    select: "id name",
  });
  if (product) {
    product.reviews = await Review.find({ product: req.params.id }).select(
      "body rating"
    );
    return res.status(200).json({ success: true, product });
  } else {
    const error = new Error(`Product with id ${req.params.id} Not Found`);
    error.status = 404;
    error.type = "custom";
    throw error;
  }
};

exports.getAllProducts = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;

  const all_products = await Product.paginate({}, { page, limit });
  return res.status(200).json({ success: true, all_products });
};

exports.updateProduct = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error(`Invalid Product ID: ${req.params.id}`);
    error.status = 400;
    error.type = "custom";
    throw error;
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    const error = new Error(`Product with id ${req.params.id} Not Found`);
    error.status = 404;
    error.type = "custom";
    throw error;
  }

  if (String(product.addedBy) !== req.user.id) {
    const err = Error("Your are not the owner of this product");
    err.status = 401;
    err.type = "custom";
    throw err;
  } else {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({ success: true, updatedProduct });
  }
};

exports.deleteProduct = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error(`Invalid Product ID: ${req.params.id}`);
    error.status = 400;
    error.type = "custom";
    throw error;
  }
  const product = await Product.findById(req.params.id);
  console.log(req.user.email);
  if (product) {
    if (String(product.addedBy) !== req.user.id) {
      const err = Error("Your are not the owner of this product");
      err.status = 401;
      err.type = "custom";
      throw err;
    } else {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      res.status(204).json({ success: true, deletedProduct });
    }
  } else {
    const error = new Error(`Product with id ${req.params.id} Not Found`);
    error.status = 404;
    error.type = "custom";
    throw error;
  }
};

exports.filterProduct = async (req, res, next) => {
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
};

exports.searchProducts = async (req, res) => {
  const query = req.query.q;
  const searchFeild = ["name", "description"];
  const page = Number(req.query) || 1;
  const limit = Number(req.query) || 5;

  const searchQuery = { $or: [] };
  searchFeild.forEach((f) => {
    searchQuery.$or.push({ [f]: { $regex: query, $options: "i" } });
  });
  const select = { name: 1, _id: 1, unitPrice: 1, category: 1 };
  const result = await Product.paginate(searchQuery, { page, limit, select });
  res.status(200).json({ success: true, result });
};

exports.stockReports = async (req, res) => {
  const products = await Product.find(
    { stock: { $lt: process.env.CRITICAL_STOCK_VALUE } },
    { name: 1, category: 1, stock: 1, unitPrice: 1 }
  ).sort({ stock: 1 });
  res.json({ products });
};

exports.sellProduct = async (req, res) => {
  const quantity = parseInt(req.query.quantity) || 1;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error(`Invalid Product ID: ${req.params.id}`);
    error.status = 400;
    error.type = "custom";
    throw error;
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    const err = Error(`Product with id ${req.params.id} is not Found`);
    err.status = 404;
    err.type = "custom";
    throw err;
  }

  if (String(product.addedBy) !== req.user.id) {
    const err = Error(`You're not the owner of the product`);
    err.status = 401;
    err.type = "custom";
    throw err;
  }

  const stock = product.stock - quantity;
  if (stock < 0) {
    const err = Error(
      `Insuffcient product in stock: Stock(${product.stock}) is less than ${quantity}`
    );
    err.status = 400;
    err.type = "custom";
    throw err;
  }
  const stockNow = await Product.findByIdAndUpdate(req.params.id, { stock });

  res.status(200).json({
    success: true,
    prevStock: product.stock,
    nowStock: stock,
    stockNow,
  });
};
