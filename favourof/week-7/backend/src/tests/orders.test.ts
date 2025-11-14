import request from "supertest";
import app from "../app";

describe("Orders Module", () => {
  it("should create a new order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ product: "Laptop", quantity: 2, price: 1500 });

    expect(res.status).toBe(201);
    expect(res.body.total).toBe(3000);
  });

  it("should fetch all orders", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch a single order by id", async () => {
    await request(app)
      .post("/api/orders")
      .send({ product: "Phone", quantity: 1, price: 800 });
    const res = await request(app).get("/api/orders/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  it("should return 404 for invalid order id", async () => {
    const res = await request(app).get("/api/orders/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Order not found");
  });
});
