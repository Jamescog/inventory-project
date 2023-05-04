const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");

// Load the environment variables
dotenv.config({ path: "./config/.env" });

//Connect to DB
connectDB();

// Import the router
const mainRouter = require("./routes/mainRouter");

// Create the app
const app = express();

// Load Global Middlewares
app.set("trust proxy", 1);
app.use(express.static("static"));
app.use(cors());
app.use(express.json());

// Mount the router
app.use("/api", mainRouter);

// Get the status of the server
app.get("/status", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
