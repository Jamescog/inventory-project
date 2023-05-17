const mongoose = require("mongoose");
const request = require("supertest");
const dotenv = require("dotenv");
const app = require("../app");
const path = require();

dotenv.config({ path: "../config/.env" });
beforeEach(async () => {
  console.log(process.env.DB_URI);
  await mongoose.connect(process.env.DB_URI);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET /api/products", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
