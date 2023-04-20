const mongoose = require("mongoose");

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.DB_URI, {
    useUnifiedTopology: true,
  });

  console.log(`MongoDB connected: ${connect.connection.host}`);
};

module.exports = connectDB;
