import request from "supertest";
import app from "../app";

describe("Products Module", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return a product by id", async () => {
    const res = await request(app).get("/api/products/1");
    expect(res.status).toBe(200);
    expect(res.body.name).toBeDefined();
  });

  it("should return 404 for invalid id", async () => {
    const res = await request(app).get("/api/products/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });

  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Tablet", price: 600 });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Tablet");
  });
});
