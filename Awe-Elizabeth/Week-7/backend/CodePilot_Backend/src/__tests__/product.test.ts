import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";
import Product from "../models/Products";
import { connectTestDB, closeTestDB, clearTestDB } from "./setupTestDB";
import { UserRoles } from "../utilities/enums/UserRole";

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe("Product Auth Tests", () => {
  it("should reject product creation if not logged in", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .send({
        name: "Unauthorized Product",
        description: "Should fail",
        price: 50,
        category: "Misc",
        stockQuantity: 1,
      })
      .expect(401);
      console.log(res.body)
    expect(res.body.message).toMatch(/No token provided|Invalid|Unauthorized/);
  });

  it("should allow logged-in user to create a product", async () => {
    // 1️⃣ Create a fake user in DB
    const user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "Hashed123*",
      role: UserRoles.Admin,
      tokenValidity: 1
    });

    // 2️⃣ Generate JWT for the test user
    const token = jwt.sign({ id: user._id, tokenValidity: 1}, process.env.JWT_SECRET || "testsecret", {
      expiresIn: "1h",
    });

    // 3️⃣ Make authorized request
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Laptop",
        description: "High-end machine",
        price: 1000,
        category: "Electronics",
        stockQuantity: 5,
        imageUrl: "url"
      })
      .expect(201);

    // 4️⃣ Validate response
    expect(res.body.result.name).toBe("Laptop");

    // 5️⃣ Verify it's in the DB
    const saved = await Product.findOne({ name: "Laptop" });
    expect(saved).not.toBeNull();
  });
});
