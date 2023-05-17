const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const reviewSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add the title of the reviw(<=100 chars)"],
  },
  body: {
    type: String,
    required: [true, "Please add the text of the review"],
  },
  rating: {
    type: Number,
    required: [true, "Please add the rating for product(1-10)"],
    min: 1,
    max: 10,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

reviewSchema.set("toJSON", {
  transform: (_, obj) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
  },
});

reviewSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Review", reviewSchema);
