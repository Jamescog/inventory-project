const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load the environment variables
dotenv.config({ path: "./config/.env" });

// Load Global Middlewares
app.use(express.static("static"));
app.use(cors());
app.use(express.json());

//Connect to DB
connectDB();
app.get("/status", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
