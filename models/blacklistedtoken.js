const mongoose = require("mongoose");

const blacklistSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ExpiredToken", blacklistSchema);
