// src/modules/products/__tests__/product.integration.test.ts
import request from "supertest";
import app from "../../../app";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/client";

let token: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      email: "prodint@test.com",
      password: "hashed",
      name: "Test User",
    },
  });
  token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
});

afterAll(async () => {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe("Product Integration Tests", () => {
  it("should create a product (protected)", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Laptop", price: 1200, stock: 5 });

    expect(res.status).toBe(201);
    expect(res.body.product.name).toBe("Laptop");
  });

  it("should retrieve all products (public)", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should fetch a single product by ID", async () => {
    const product = await prisma.product.create({
      data: { name: "Tablet", price: 499, stock: 8 },
    });

    const res = await request(app).get(`/api/products/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Tablet");
  });
});
