const Review = require("../models/review");
const mongoose = require("mongoose");

exports.createReview = async (req, res) => {
  req.body.author = req.user.id;
  const review = Review(req.body);
  const createdReview = await review.save();

  res.status(201).json({
    success: true,
    message: `Review Created successfully`,
    createdReview,
  });
};

exports.fetchReview = async (req, res) => {
  const review = await Review.findById(req.params.id).populate({
    path: "product author",
    select: "name, description",
  });

  if (!review) {
    const err = Error(`Review with id ${req.params.id} is not Found`);
    err.status = 404;
    err.type = "custom";
    throw err;
  }

  res.status(200).json({
    success: true,
    review,
  });
};

exports.editReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    const err = Error(`Review with id ${req.params.id} is not Found`);
    err.status = 404;
    err.type = "custom";
    throw err;
  }

  if (String(review.author) !== req.user.id) {
    const err = Error(`You're not the author of this review`);
    err.status = 401;
    err.type = "custorm";
    throw err;
  }
  const editedReview = await Review.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    success: true,
    editedReview,
  });
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    if (String(review.author === req.user.id)) {
      await Review.findByIdAndDelete(req.params.id);
      res.status(204).json({
        success: true,
        message: `Review with id ${req.params.id} is deleted successfully`,
      });
    } else {
      const err = Error(`You're not the owner of the review`);
      err.status = 401;
      err.type = "custorm";
      throw err;
    }
  } else {
    const err = Error(`Review with id ${req.params.id} is not Found`);
    err.status = 404;
    err.type = "custom";
    throw err;
  }
};
