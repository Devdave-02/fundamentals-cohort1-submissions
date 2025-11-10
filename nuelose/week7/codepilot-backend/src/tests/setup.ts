import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app"; 
import * as dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export const testUtils = {
  async cleanDB() {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  },

  async createTestUser() {
    const password = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Tester", password },
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    return { user, token };
  },
  async loginAndGetToken() {
    await request(app).post("/api/users/").send({
      name: "E2E User",
      email: "e2e@test.com",
      password: "password123",
    });

    const loginRes = await request(app).post("/api/users/login").send({
      email: "e2e@test.com",
      password: "password123",
    });

    return loginRes.body.token;
  },

  async createTestProduct(token?: string) {
    if (token) {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Laptop",
          price: 1200,
          stock: 5,
        });
      return res.body.product;
    } else {
      return prisma.product.create({
        data: {
          name: "Laptop",
          price: 1200,
          stock: 5,
        },
      });
    }
  },
  async createTestOrder(userId: number, productId: number) {
    return prisma.order.create({
      data: {
        userId,
        total: 1200,
        items: {
          create: [{ productId, qty: 1, price: 1200 }],
        },
      },
      include: { items: true },
    });
  },
};

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
