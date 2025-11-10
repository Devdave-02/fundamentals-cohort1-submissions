import request from "supertest";
import app from "../../../app";
import { prisma, testUtils } from "../../../tests/setup";

describe("Order Module - E2E", () => {
  let token: string;
  let product: any;

  beforeAll(async () => {
    await testUtils.cleanDB();
    token = await testUtils.loginAndGetToken();
    product = await testUtils.createTestProduct(token);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new order successfully", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{ productId: product.id, qty: 1 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.items.length).toBe(1);
  });

  it("should get all user orders", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
