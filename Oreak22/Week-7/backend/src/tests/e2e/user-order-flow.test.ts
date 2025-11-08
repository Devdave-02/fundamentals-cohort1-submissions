import request from "supertest";
import app from "../../app";
import Product from "../../models/product.model";

describe("User End-to-End Order Flow", () => {
  it("registers → creates order", async () => {
    const prod = await Product.create({ name: "E2E Product", price: 9.99 });

    const register = await request(app)
      .post("/auth/register")
      .send({ email: "flow@mail.com", password: "12345678" });
    expect(register.status).toBe(201);
    const token = register.body.token;
    expect(token).toBeDefined();

    const order = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: prod._id.toString() });

    expect(order.status).toBe(201);
    expect(order.body).toHaveProperty("_id");
  });
});
