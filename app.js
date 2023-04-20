const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load the environment variables
dotenv.config({ path: "./config/.env" });
//Connect to DB
connectDB();

// Route files
const users = require("./routes/users");
const products = require("./routes/products");
// Create the app
const app = express();

// Load Global Middlewares
app.use(express.static("static"));
app.use(cors());
app.use(express.json());

// Mount the routers
app.use("/api/users/", users);
app.use("/api/products", products);

app.get("/status", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
