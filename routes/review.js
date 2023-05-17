const express = require("express");
const { createReview, fetchReview } = require("../controllers/reviews");
const { verifyToken } = require("../middlewares/verifyToken");

const reviewRouter = express.Router();
reviewRouter.post("/", verifyToken, createReview);
reviewRouter.get("/:id", fetchReview);

module.exports = reviewRouter;
