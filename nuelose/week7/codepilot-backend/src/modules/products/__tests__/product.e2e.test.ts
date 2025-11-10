// src/modules/products/__tests__/product.e2e.test.ts
import request from "supertest";
import app from "../../../app";
import prisma from "../../../prisma/client";

let token: string;
let createdProductId: number;

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  await request(app)
    .post("/api/users/")
    .send({ email: "e2e@test.com", password: "password123", name: "E2E User" });

  const loginRes = await request(app)
    .post("/api/users/login")
    .send({ email: "e2e@test.com", password: "password123" });

  token = loginRes.body.token;
});

afterAll(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe("Product End-to-End (E2E) Tests", () => {
  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Headphones", price: 199.99, stock: 15 });

   

    expect(res.status).toBe(201);
    expect(res.body.product).toHaveProperty("id");
    createdProductId = res.body.product.id;
  });

  it("should get all products", async () => {
     const all = await prisma.product.findMany();
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update the product", async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 149.99 });

    expect(res.status).toBe(200);
    expect(res.body.product.price).toBe(149.99);
  });

  it("should delete the product", async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Product deleted");
  });
});
