const express = require("express");
const productRouter = require("./products");
const userRouter = require("./users");
const reviewRouter = require("./review");
const mainRouter = express.Router();

mainRouter.use("/products", productRouter);
mainRouter.use("/users", userRouter);
mainRouter.use("/review", reviewRouter);

module.exports = mainRouter;
