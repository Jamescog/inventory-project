const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

// Load the environment variables
dotenv.config({ path: "./config/.env" });
connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`🚀️ Server is running on http://localhost:${PORT}`)
);
