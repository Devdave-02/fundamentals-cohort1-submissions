import request from "supertest";
import app from "../app";
import { connectTestDB, closeTestDB, clearTestDB } from "./setupTestDB";
import Product from "../models/Products";
import Orders from "../models/Orders";
import mongoose from "mongoose";
import User from "../models/User";
import { UserRoles } from "../utilities/enums/UserRole";
import jwt from "jsonwebtoken";


beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe("Order API", () => {

  
  it("should create an order with valid products", async () => {
     const user = await User.create({
          firstName: "lizzy",
          lastName: "shire",
          email: "shire@example.com",
          password: "Hashed123*",
          role: UserRoles.Admin,
          tokenValidity: 1
        });
    
        // 2️⃣ Generate JWT for the test user
        const token = jwt.sign({ id: user._id, tokenValidity: 1}, process.env.JWT_SECRET || "testsecret", {
          expiresIn: "1h",
        });

    const product = await Product.create({
      userId: new mongoose.Types.ObjectId(),
      name: "Phone",
      description: "Smartphone",
      price: 800,
      category: "Electronics",
      stockQuantity: 10,
    });

    const orderData = {
      productDetails: [{ productId: product._id, quantity: 2}],
    };

    const res = await request(app)
    .post("/api/v1/orders")
    .set("Authorization", `Bearer ${token}`)
    .send(orderData).expect(201);

    expect(res.body.result.totalAmount).toBe(1600);
    expect(res.body.result.products[0].quantity).toBe(2);
  });

  it("should update a created order status", async () => {
     const user = await User.create({
          firstName: "lizzy",
          lastName: "shire",
          email: "shire@example.com",
          password: "Hashed123*",
          role: UserRoles.Entrepreneur,
          tokenValidity: 1
        });
    
        // 2️⃣ Generate JWT for the test user
        const token = jwt.sign({ id: user._id, tokenValidity: 1}, process.env.JWT_SECRET || "testsecret", {
          expiresIn: "1h",
        });

    const product = await Product.create({
      userId: new mongoose.Types.ObjectId(),
      name: "Phone",
      description: "Smartphone",
      price: 800,
      category: "Electronics",
      stockQuantity: 10,
    });

    const order = await Orders.create({
      userId: new mongoose.Types.ObjectId(),
      products: [{
        productId: product._id,
        quantity: 2,
        price: product.price
      }],
      totalAmount: 1600,
      status: "pending"
    })

    const orderData = {
     status: "paid"
    };

    const res = await request(app).put(`/api/v1/orders/${order._id}/status`)
    .set("Authorization", `Bearer ${token}`)
    .send(orderData).expect(200);
    expect(res.body.result.status).toBe("paid");
  });

  it("should return 404 if order not found", async () => {
     const user = await User.create({
          firstName: "lizzy",
          lastName: "shire",
          email: "lizzy@example.com",
          password: "Hashed123*",
          role: UserRoles.Admin,
          tokenValidity: 1
        });
    
        // 2️⃣ Generate JWT for the test user
        const token = jwt.sign({ id: user._id, tokenValidity: 1}, process.env.JWT_SECRET || "testsecret", {
          expiresIn: "1h",
        });

    const fakeId = new mongoose.Types.ObjectId();
      const orderData = {
     status: "paid"
    };
    const res = await request(app)
      .put(`/api/v1/orders/${fakeId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send(orderData)
      .expect(404);

    expect(res.body.message).toMatch(/not found/i);
  });
});




