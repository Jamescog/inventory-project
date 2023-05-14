require("express-async-errors");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
const { error404 } = require("./middlewares/error404");

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
// Get the status of the server
app.get("/status", (req, res) => {
  res.json({ status: "OK" });
});

// Mount the router
app.use("/api", mainRouter);
app.use(errorHandler);
app.use(error404);
module.exports = app;
