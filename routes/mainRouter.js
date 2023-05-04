const express = require("express");
const productRouter = require("./products");
const userRouter = require("./users");
const mainRouter = express.Router();

mainRouter.use("/products", productRouter);
mainRouter.use("/users", userRouter);

module.exports = mainRouter;
