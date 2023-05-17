const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

productSchema.set("toJSON", {
  transform: (_, obj) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
  },
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);
